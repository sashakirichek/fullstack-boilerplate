/**
 * Custom Passport strategy for Google OAuth2 using the Fetch API.
 *
 * passport-google-oauth20 depends on Node's `https` module which is
 * unavailable in Cloudflare Workers.  This strategy implements the same
 * authorization-code flow with PKCE (S256) + state using only `fetch()`.
 */
import {Strategy} from 'passport'

// Augment express-session with temporary OAuth fields
declare module 'express-session' {
  interface SessionData {
    oauthState?: string
    codeVerifier?: string
  }
}

export interface GoogleStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
}

export type VerifyCallback = (
  accessToken: string,
  refreshToken: string | undefined,
  profile: {id: string; provider: string},
  done: (err: Error | null, user?: Express.User) => void,
) => void

// ── Crypto helpers (Web Crypto API) ────────────────────────────

function toBase64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url')
}

function generateState(): string {
  return toBase64url(crypto.getRandomValues(new Uint8Array(16)))
}

function generateCodeVerifier(): string {
  return toBase64url(crypto.getRandomValues(new Uint8Array(32)))
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return toBase64url(new Uint8Array(hash))
}

// ── Token exchange ─────────────────────────────────────────────

interface TokenResponse {
  access_token: string
  id_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

async function exchangeCodeForTokens(
  opts: GoogleStrategyOptions,
  code: string,
  codeVerifier: string,
): Promise<TokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: opts.clientID,
      client_secret: opts.clientSecret,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: opts.callbackURL,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<TokenResponse>
}

// ── JWT validation ─────────────────────────────────────────────

// Hardcoded JWKS URI — never read from the token header (prevents SSRF).
const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs'
const ALLOWED_ISSUERS = ['https://accounts.google.com', 'accounts.google.com']
const CLOCK_SKEW_SECONDS = 30

interface JwksKey {
  kid: string
  kty: string
  alg: string
  n: string
  e: string
  use?: string
}

async function fetchGoogleJwks(): Promise<JwksKey[]> {
  const res = await fetch(GOOGLE_JWKS_URI)
  if (!res.ok) throw new Error(`Failed to fetch Google JWKS: ${res.status}`)
  const body = (await res.json()) as {keys: JwksKey[]}
  return body.keys
}

/**
 * Verify a Google ID token's RS256 signature and validate standard claims.
 * Returns the `sub` (subject) claim.
 */
async function verifyIdTokenSubject(idToken: string, clientID: string): Promise<string> {
  const parts = idToken.split('.')
  if (parts.length !== 3) throw new Error('Invalid id_token format')

  const [headerB64, payloadB64, signatureB64] = parts as [string, string, string]

  // ── Parse and pin algorithm ──────────────────────────────────
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString())
  if (header.alg !== 'RS256') {
    throw new Error(`Unsupported id_token algorithm: ${header.alg}`)
  }
  if (!header.kid || typeof header.kid !== 'string') {
    throw new Error('Missing kid in id_token header')
  }

  // ── Fetch signing key from Google's JWKS ─────────────────────
  const keys = await fetchGoogleJwks()
  const jwk = keys.find(k => k.kid === header.kid && k.alg === 'RS256')
  if (!jwk) {
    throw new Error(`No matching Google JWK for kid=${header.kid}`)
  }

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    {kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true},
    {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
    false,
    ['verify'],
  )

  // ── Verify signature ─────────────────────────────────────────
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const signature = Buffer.from(signatureB64, 'base64url')
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, data)
  if (!valid) {
    throw new Error('Invalid id_token signature')
  }

  // ── Validate claims ──────────────────────────────────────────
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
  const now = Math.floor(Date.now() / 1000)

  if (!ALLOWED_ISSUERS.includes(payload.iss)) {
    throw new Error(`Invalid id_token issuer: ${payload.iss}`)
  }
  if (payload.aud !== clientID) {
    throw new Error(`Invalid id_token audience: ${payload.aud}`)
  }
  if (typeof payload.exp !== 'number' || payload.exp + CLOCK_SKEW_SECONDS < now) {
    throw new Error('id_token has expired')
  }
  if (typeof payload.iat !== 'number' || payload.iat - CLOCK_SKEW_SECONDS > now) {
    throw new Error('id_token issued in the future')
  }
  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('Missing sub claim in id_token')
  }

  return payload.sub
}

// ── Passport Strategy ──────────────────────────────────────────

export class GoogleOAuth2Strategy extends Strategy {
  name = 'google'
  private opts: GoogleStrategyOptions
  private verify: VerifyCallback

  constructor(options: GoogleStrategyOptions, verify: VerifyCallback) {
    super()
    this.opts = options
    this.verify = verify
  }

  async authenticate(req: any): Promise<void> {
    // ── Callback leg (code + state present) ───────────────────
    if (req.query?.code) {
      try {
        const {code, state} = req.query

        if (!state || state !== req.session?.oauthState) {
          return this.fail({message: 'State mismatch'}, 403)
        }

        const codeVerifier = req.session?.codeVerifier
        if (!code || typeof code !== 'string' || !codeVerifier) {
          return this.fail({message: 'Missing code or code_verifier'}, 400)
        }

        // Clean up OAuth temporaries
        delete req.session.oauthState
        delete req.session.codeVerifier

        const tokens = await exchangeCodeForTokens(this.opts, code, codeVerifier)
        const subject = await verifyIdTokenSubject(tokens.id_token, this.opts.clientID)

        const profile = {id: subject, provider: 'google'}

        this.verify(tokens.access_token, tokens.refresh_token, profile, (err: Error | null, user?: Express.User) => {
          if (err) return this.error(err)
          if (!user) return this.fail({message: 'User not found'}, 401)
          return this.success(user)
        })
      } catch (err) {
        return this.error(err as Error)
      }
      return
    }

    // ── Initiation leg — redirect to Google ───────────────────
    try {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const challenge = await generateCodeChallenge(codeVerifier)

      req.session.oauthState = state
      req.session.codeVerifier = codeVerifier

      const params = new URLSearchParams({
        client_id: this.opts.clientID,
        redirect_uri: this.opts.callbackURL,
        response_type: 'code',
        scope: 'openid',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      })

      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`

      // Save session before redirect so the cookie is set
      req.session.save(() => {
        this.redirect(url)
      })
    } catch (err) {
      return this.error(err as Error)
    }
  }
}

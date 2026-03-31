---
name: oauth2-security-for-developers
description:
  OAuth2 implementation rules for tasks that add login flows, redirects, PKCE, token exchange, or scope handling to this
  monorepo.
---

# OAuth2 Security For Developers

Status: distilled from RFC 9700 and the OWASP OAuth 2.0 Protocol Cheatsheet.

Use when a change introduces OAuth2 or OpenID Connect style login, redirects, callback handlers, or token exchange
logic.

- Default browser-facing OAuth flows to authorization code plus PKCE using `S256`. Do not use the implicit grant for new
  work, and do not use the resource owner password credentials grant.
- Match every `redirect URI` exactly, reject open redirectors, and use exact receiver or sender origin checks for any
  `postMessage`-style in-browser response flow.
- Bind each transaction to the user agent with PKCE, `state`, and `nonce` as appropriate. When multiple authorization
  servers are involved, defend against mix-up with issuer identification or distinct callback routes.
- Keep `client secret` material, code exchange, refresh token handling, and issuer metadata trust decisions on the
  server side rather than in frontend code.
- Keep `scope` minimal, restrict audience and resource access, and prefer sender-constrained tokens or refresh-token
  rotation when the risk justifies it.
- Prevent credential leakage through Referer headers, browser history, token-in-URL patterns, and unsafe redirects. If a
  credential POST must redirect, use behavior equivalent to `303`, not `307`.
- If the repo does not currently implement OAuth2, say `Not Present` directly instead of inferring a hidden flow from
  generic HTTP code.

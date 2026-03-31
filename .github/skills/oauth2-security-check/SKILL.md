---
name: oauth2-security-check
description:
  Review OAuth2 and OIDC style login flows in this repo. Use whenever changes add redirect handlers, authorization code
  exchange, PKCE, state or nonce handling, callback routes, client secret placement, token replay protection, or
  browser-based login messaging, even if the user only mentions login, callback URLs, or a new identity provider.
argument-hint: '[feature, route, or files to review]'
user-invocable: true
disable-model-invocation: true
---

# OAuth2 Security Check

## When to Use

Use this skill when a change introduces OAuth2 or OIDC concepts such as an `authorization code` flow, `PKCE`,
`redirect URI` handling, callback endpoints, token exchange, `scope` changes, or in-browser auth messaging. This skill
is aligned to `oauth2securityfordevelopers.pdf`, so prefer it for login-flow reviews even when the code change looks
like ordinary routing or HTTP client setup.

## Review Workflow

1. Inspect `frontend/start-basic-react-query/src/routes/api/users.ts`, `backend/node-express-backend/src/server.ts`, and
   `backend/node-express-backend/src/worker.ts` first.
2. Search for `authorization code`, `PKCE`, `redirect URI`, `code_challenge`, `code_verifier`, `state`, `nonce`,
   `scope`, issuer handling, refresh tokens, `client secret`, `postMessage`, and token exchange logic.
3. If a browser flow exists, require authorization code plus `PKCE` using `S256`, exact `redirect URI` and origin
   matching, and no open redirectors or wildcard callback matching.
4. Ensure any `client secret`, code exchange, issuer metadata trust, and refresh-token handling remain on the server
   side and never enter frontend bundles or browser-visible responses.
5. Review `state`, `nonce`, issuer identification, and multi-provider behavior so mix-up attacks, code injection, and
   PKCE downgrade paths are closed.
6. Review minimal `scope`, audience or sender-constrained token behavior, Referer or history leakage, and redirect
   behavior so credential POSTs do not rely on unsafe `307` semantics.
7. If browser auth responses are delivered via `postMessage`, require exact receiver and sender origin matching and
   reject wildcard targets.
8. If the repo has no OAuth2 logic, report `Not Present` instead of guessing from generic HTTP requests.

## Current Repo Focus

- `frontend/start-basic-react-query/src/routes/api/users.ts` is currently a public sample-data route and not an auth
  callback or login surface.
- `backend/node-express-backend/src/server.ts` has no login routes, callback handlers, or token exchange logic today.
- `backend/node-express-backend/src/worker.ts` is the request boundary where future redirect or callback forwarding
  could appear.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                                              | Status           | Finding | Fix Applied |
| --- | ---------------------------------------------------------------------------------- | ---------------- | ------- | ----------- |
| 1   | Flow keyword scan (`authorization code`, `PKCE`, `redirect URI`, `state`, `nonce`) | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | PKCE `S256` & exact redirect URI / origin matching                                 | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | Client secret, code exchange & refresh token server-side only                      | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | `state` / `nonce` / issuer identification (mix-up defense)                         | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | Minimal `scope`, audience binding, sender-constrained tokens                       | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | Referer / history leakage & safe redirect semantics (no `307` POST)                | ✅ / ⚠️ / ❌ / — |         |             |
| 7   | `postMessage` origin matching (browser auth responses)                             | ✅ / ⚠️ / ❌ / — |         |             |
| 8   | Overall: OAuth2/OIDC flow present?                                                 | ✅ / Not Present |         |             |

> Fill one status per row: **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable.  
> For each ❌ or ⚠️, describe the fix in the last column (or "pending" if unresolved).

### Findings

- Severity:
- Issue:
- Evidence:
- Recommendation:

### Gaps

- Missing issuer, redirect, scope, or token-exchange details that limit confidence.

### Not Present

- List OAuth2 mechanisms that are absent from the current repo.

### Follow-up Checks

- Additional redirect, callback, or issuer paths to inspect if OAuth2 support is added later.

### Source Relevance

- Briefly note which `oauth2securityfordevelopers.pdf` concerns are actually in play: PKCE, exact redirect URI checks,
  mix-up defense, token replay, refresh-token rotation, Referer leakage, 307 redirects, clickjacking, or none.

## Not Present Rules

- If no `authorization code`, `PKCE`, callback, token exchange, `redirect URI`, or `client secret` handling exists, say
  `Not Present: OAuth2 is not implemented in the current repo.`
- Do not infer OAuth2 from plain REST endpoints or public sample-data routes.
- If only generic HTTP code exists, keep the report narrow and evidence-based.

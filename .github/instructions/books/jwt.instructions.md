---
name: jwt
description: JWT implementation and review rules for tasks that add token issuance, parsing, transport, or validation to this monorepo.
---

# JWT

Status: distilled from the OWASP JWT Cheat Sheet and RFC 8725.

Use when a change introduces JWT creation, verification, transport, or storage.

- Do not add JWTs unless a stateless token boundary is actually required. Prefer simpler server sessions when statelessness is not needed.
- Pin accepted algorithms and key types during verification. Reject `none`, algorithm confusion, and any library default that trusts the token header more than application config.
- Validate the claims the flow depends on: `exp`, `nbf`, `iat`, `iss`, `sub`, `aud`, and `typ` where token kinds could be confused.
- Use strong, non-human secrets for HMAC keys or asymmetric keys for signing. Keep keys server-side only and bind each key to one token type or algorithm.
- Treat received headers and lookup values such as `kid`, `jku`, and `x5u` as untrusted input. Do not allow them to trigger SSRF, SQL, or LDAP lookups without allowlists and validation.
- Do not assume JWT payloads are secret. Avoid putting sensitive internal data in tokens unless the design explicitly encrypts them and still validates signatures.
- Do not persist JWTs in browser-visible storage by default. Audit any future `Authorization` or `Bearer` handling across `backend/node-express-backend/src/worker.ts`, `backend/node-express-backend/src/server.ts`, and frontend fetch utilities before shipping the change.
- If the repo still has no JWT auth layer, report `Not Present` rather than inferring one from generic HTTP code.
---
name: jwt-security-check
description: Review JWT creation, parsing, transport, verification, replay handling, and client storage rules in this repo. Use whenever changes add Authorization headers, Bearer tokens, token claims, signing or verification code, token revocation, or browser token storage, even if the user only mentions middleware, auth headers, or a helper function.
argument-hint: "[feature, route, or files to review]"
user-invocable: true
disable-model-invocation: true
---

# JWT Security Check

## When to Use

Use this skill when a change introduces JWT issuance, verification, `Authorization` parsing, `Bearer` transport, revocation, or token claims such as `exp`, `aud`, or `iss`. This skill is aligned to `jwt.pdf`, so prefer it for token-format reviews even when the change is framed as generic authentication plumbing.

## Review Workflow

1. Inspect `backend/node-express-backend/src/server.ts`, `backend/node-express-backend/src/worker.ts`, and `frontend/start-basic-react-query/src/utils/posts.tsx` first.
2. Search for `Authorization`, `Bearer`, `jwt`, signing helpers, verify or decode paths, `alg`, `typ`, `exp`, `nbf`, `iat`, `aud`, `iss`, `kid`, `jku`, and `x5u`.
3. If JWTs exist, verify explicit algorithm and key binding, reject `none` or algorithm confusion, and keep validation rules mutually exclusive across token types.
4. Check claim validation for `exp`, `nbf`, `iat`, `iss`, `aud`, `sub`, and `typ`, and treat lookup values such as `kid`, `jku`, or `x5u` as untrusted input that can trigger SSRF or injection if mishandled.
5. Check whether verification secrets or private keys stay on the server side, whether any token is stored in browser storage or logs, and whether replay or sidejacking resistance is explicit rather than assumed.
6. If a logout, denylist, rotation, or session-binding story exists, review it explicitly. JWT format alone does not provide revocation, confidentiality, or reuse protection.
7. If the repo does not implement JWT auth at all, report `Not Present` and stop short of speculative findings.

## Current Repo Focus

- `backend/node-express-backend/src/server.ts` currently exposes only posts endpoints and has no `Authorization` or `Bearer` parsing.
- `backend/node-express-backend/src/worker.ts` forwards requests into Express and would be a likely boundary for future JWT header handling.
- `frontend/start-basic-react-query/src/utils/posts.tsx` calls the backend and is a likely place where future client token transport would show up.

## Output Format

### Analysis & Remediation Checklist

| # | Check | Status | Finding | Fix Applied |
|---|-------|--------|---------|-------------|
| 1 | Token keyword scan (`Authorization`, `Bearer`, `jwt`, `alg`, claims) | ✅ / ⚠️ / ❌ / — | | |
| 2 | Algorithm & key binding (reject `none`, no algorithm confusion) | ✅ / ⚠️ / ❌ / — | | |
| 3 | Claim validation (`exp`, `nbf`, `iat`, `iss`, `aud`, `sub`, `typ`) | ✅ / ⚠️ / ❌ / — | | |
| 4 | Untrusted lookup values (`kid`, `jku`, `x5u` → SSRF risk) | ✅ / ⚠️ / ❌ / — | | |
| 5 | Secret/key server-side confinement & no browser/log exposure | ✅ / ⚠️ / ❌ / — | | |
| 6 | Logout, denylist, rotation, or session-binding story | ✅ / ⚠️ / ❌ / — | | |
| 7 | Overall: JWT auth present? | ✅ / Not Present | | |

> Fill one status per row: **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable.  
> For each ❌ or ⚠️, describe the fix in the last column (or "pending" if unresolved).

### Findings

- Severity:
- Issue:
- Evidence:
- Recommendation:

### Gaps

- Missing signing, verification, or claim-validation details that prevent a stronger conclusion.

### Not Present

- List JWT mechanisms that are absent from the current repo.

### Follow-up Checks

- Additional token-handling areas to inspect if JWT support is added later.

### Source Relevance

- Briefly note which `jwt.pdf` concerns are actually in play: algorithm confusion, weak secrets, claim validation, sidejacking, revocation, token disclosure, client storage, or none.

## Not Present Rules

- If there is no JWT creation, verification, `Authorization` parsing, or `Bearer` transport, say `Not Present: JWT auth is not implemented in the current repo.`
- Do not infer a token layer from generic HTTP requests, sample APIs, or future-looking package names.
- If claims like `alg`, `exp`, `aud`, or `iss` never appear because JWTs are absent, record that absence instead of manufacturing failures.
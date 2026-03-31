---
name: browser-secrets-check
description:
  Review browser-side secret handling, storage, cookies, headers, CORS, postMessage, caching, and request boundaries in
  this repo. Use whenever changes touch localStorage, sessionStorage, Set-Cookie, Authorization headers, postMessage,
  browser caches, Worker forwarding, sessions, or any client-visible auth/session data, even if the user only mentions a
  fetch helper, proxy, or response shape.
argument-hint: '[feature, route, or files to review]'
user-invocable: true
disable-model-invocation: true
---

# Browser Secrets Check

## When to Use

Use this skill when a change touches browser storage, cookies, headers, caches, server functions, JSON responses,
`postMessage`, CORS, or `backend/node-express-backend/src/worker.ts` request forwarding. This skill is aligned to
`browsersecrets.pdf`, so prefer it for client-visible secret handling questions even when the code change looks like a
plain networking or response-format task.

## Review Workflow

1. Inspect `frontend/start-basic-react-query/src/utils/posts.tsx`,
   `frontend/start-basic-react-query/src/routes/api/users.ts`,
   `frontend/start-basic-react-query/src/routes/api/users.$id.ts`, `backend/node-express-backend/src/server.ts`, and
   `backend/node-express-backend/src/worker.ts` first.
2. Search the touched code for `localStorage`, `sessionStorage`, IndexedDB, `document.cookie`, `Set-Cookie`,
   `Authorization`, `postMessage`, `Cache-Control`, `Access-Control-Allow-Origin`, and token-like query parameters.
3. If cookies or session state are introduced, verify explicit `HttpOnly`, `Secure`, `SameSite`, narrow `Domain` and
   `Path`, host-only scope or `__Host-` usage where practical, and `Max-Age` no longer than the underlying session or
   token lifetime.
4. Check whether any response body, server function, or forwarded header returns client-visible secret material. Review
   browser messaging for exact origin checks, reject wildcard targets, and ensure message data is treated as data rather
   than HTML or code.
5. Review CORS, caching, offline storage, and logs so secret-bearing responses are `no-store` where appropriate and
   never leak through browser caches, proxy caches, URLs, autocomplete, or debug output.
6. If the change opens new tabs or embeds remote content, check `rel="noopener noreferrer"`, `sandbox`, and framing
   boundaries because those browser features can widen the secret boundary indirectly.
7. If none of those mechanisms exist, report `Not Present` instead of inventing a vulnerability.

## Current Repo Focus

- `frontend/start-basic-react-query/src/utils/posts.tsx` fetches post data and currently does not store secrets in
  `localStorage` or `sessionStorage`.
- `frontend/start-basic-react-query/src/routes/api/users.ts` and
  `frontend/start-basic-react-query/src/routes/api/users.$id.ts` proxy public sample data and should remain secret-free.
- `backend/node-express-backend/src/server.ts` exposes a simple posts API and is the first place cookie or session logic
  would become explicit.
- `backend/node-express-backend/src/worker.ts` is the main request and response boundary where forwarded cookies, cache
  headers, or secret-bearing headers would appear.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                                                     | Status           | Finding | Fix Applied |
| --- | ----------------------------------------------------------------------------------------- | ---------------- | ------- | ----------- |
| 1   | Storage & cookie scan (`localStorage`, `sessionStorage`, `document.cookie`, `Set-Cookie`) | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | Cookie attributes (`HttpOnly`, `Secure`, `SameSite`, `__Host-`, `Max-Age`)                | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | Response body & header secret leakage                                                     | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | `postMessage` origin checks & messaging safety                                            | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | CORS, caching (`no-store`), proxy & log leakage                                           | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | Framing & tab boundaries (`noopener`, `sandbox`)                                          | ✅ / ⚠️ / ❌ / — |         |             |
| 7   | Overall: secret mechanism present?                                                        | ✅ / Not Present |         |             |

> Fill one status per row: **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable.  
> For each ❌ or ⚠️, describe the fix in the last column (or "pending" if unresolved).

### Findings

- Severity:
- Issue:
- Evidence:
- Recommendation:

### Gaps

- Missing verification or design information that prevents a stronger conclusion.

### Not Present

- List security mechanisms that are not implemented in the current repo.

### Follow-up Checks

- Additional targeted searches or tests worth running if the feature grows beyond the current design.

### Source Relevance

- Briefly note which browser-secret concerns from `browsersecrets.pdf` are actually exercised by the touched code:
  storage, cookies, messaging, CORS, caching, framing, or none.

## Not Present Rules

- If no app-level cookie, session, bearer token, `localStorage`, or `sessionStorage` mechanism exists, say so explicitly
  in `Not Present`.
- Do not infer secrets from public sample data, generic `axios` usage, or plain JSON routes.
- If the current code only moves public data, the correct answer can be that browser secret handling is not implemented
  in the current repo.

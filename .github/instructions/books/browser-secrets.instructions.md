---
name: browser-secrets
description: Browser-secret handling rules for changes that touch client-visible data, cookies, storage, caching, or request boundaries in this monorepo.
---

# Browser Secrets

Status: distilled from OWASP HTML5 Security Cheat Sheet and MDN Set-Cookie guidance.

Use when a change touches browser storage, cookies, request headers, caches, cross-origin messaging, or Worker forwarding.

- Keep credentials, session identifiers, refresh tokens, and internal headers out of `localStorage`, `sessionStorage`, IndexedDB, URL parameters, and client-visible JSON by default.
- Prefer server-managed session state with hardened cookies when browser state is unavoidable. Make `HttpOnly`, `Secure`, `SameSite`, host-only scope or `__Host-` usage, and `Max-Age` decisions explicit.
- Treat `postMessage`, CORS, and cache policy as secret boundaries. Match origins exactly, never use `*` for sensitive flows, and never evaluate or HTML-render message data.
- Do not expose sensitive responses with permissive `Access-Control-Allow-Origin` values or cache secret-bearing responses in browser, proxy, or offline caches.
- Review `backend/node-express-backend/src/worker.ts` and `backend/node-express-backend/src/server.ts` before adding cookie forwarding, header rewriting, cache headers, or request logging.
- Treat payloads returned from `frontend/start-basic-react-query/src/utils/posts.tsx` and `frontend/start-basic-react-query/src/routes/api/users.ts` as client-visible. Never embed secret material, internal tokens, or privileged metadata there.
- If the touched area does not currently implement cookies, sessions, or token storage, preserve that absence and report `Not Present` instead of introducing new browser secret state casually.
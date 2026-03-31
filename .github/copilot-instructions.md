# Repo Guidance

- Keep changes scoped to the package being edited and preserve the current monorepo split between `backend/node-express-backend` and `frontend/start-basic-react-query`.
- Keep frontend and backend contracts explicit. When the same payload shape is used in both places, prefer extracting a shared type instead of duplicating it again.
- Prefer value-returning helpers over helpers that mix data shaping, logging, and I/O. Keep route handlers, React components, and worker/server entrypoints thin and move reusable logic into testable functions.
- In async code, avoid mutating shared bindings across `await` or parallel work when a derived array or object can be returned instead. Prefer explicit `Promise.all` pipelines and combine results after the async work completes.
- Add the narrowest useful test in the package you changed. Use Jest in the backend and Vitest in the frontend.
- Treat `backend/node-express-backend/src/worker.ts` and server routes under `frontend/start-basic-react-query/src/routes/api/` as security boundaries. Review headers, cookies, response bodies, and logs before changing them.
- Do not introduce browser-side persistence for auth or session material by default. Prefer server-managed state and review it with `/browser-secrets-check` before merging.
- Do not render remote or user-controlled HTML with `dangerouslySetInnerHTML` or `innerHTML` by default. Prefer plain JSX text rendering and run `/react-xss-check` when rendering rules change.
- If a task introduces JWT or OAuth2 flows, run `/jwt-security-check` or `/oauth2-security-check` and keep the implementation explicit about algorithms, claims, redirects, and secret placement.
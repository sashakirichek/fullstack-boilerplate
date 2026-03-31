---
name: react-xss
description:
  React XSS review rules for frontend rendering changes, especially when remote or user-controlled content moves into
  JSX or HTML-like sinks.
applyTo: frontend/start-basic-react-query/src/**/*.{ts,tsx}
---

# React XSS

Status: distilled from the React DOM docs and Pragmatic Web Security's React XSS guidance.

Use when a change touches JSX rendering, HTML sinks, URL construction, rich text rendering, or API data that becomes UI
content.

- Prefer plain JSX text rendering. React escapes text nodes by default, so keep untrusted content as text unless the
  feature explicitly requires formatted HTML.
- Do not introduce `dangerouslySetInnerHTML`, `innerHTML`, or HTML-string rendering unless sanitized rich text is
  unavoidable.
- Validate untrusted `href` and `src` values with a safe allowlist strategy. React's development warning for
  `javascript:` URLs is not a sufficient defense, and `data:` URLs can also be dangerous in some sinks.
- If rich HTML is required, sanitize it with DOMPurify or an SSR-safe equivalent, create the `{__html: ...}` object
  close to sanitization, and route rendering through a dedicated component rather than ad hoc inline usage.
- Do not spread user-controlled props objects into JSX or `createElement` calls. Attackers can smuggle
  `dangerouslySetInnerHTML` or other dangerous props that way.
- Keep server routes under `frontend/start-basic-react-query/src/routes/api/` returning structured data, not HTML
  fragments.
- Treat data loaded in `frontend/start-basic-react-query/src/routes/posts.$postId.tsx` and
  `frontend/start-basic-react-query/src/routes/posts_.$postId.deep.tsx` as untrusted until rendered as plain text or
  passed through the explicit sanitization boundary.
- If no raw HTML sink exists, report `Not Present` instead of inflating plain JSX rendering into an XSS issue.

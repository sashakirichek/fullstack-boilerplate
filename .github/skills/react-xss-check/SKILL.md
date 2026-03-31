---
name: react-xss-check
description: Review React rendering paths for XSS risk in this repo. Use whenever changes touch JSX rendering, dangerouslySetInnerHTML, innerHTML, rich text, markdown, createElement, prop spreading from user data, untrusted href or src values, or remote content displayed in the UI, even if the user only describes it as content rendering or a formatter.
argument-hint: "[component, route, or files to review]"
user-invocable: true
disable-model-invocation: true
---

# React XSS Check

## When to Use

Use this skill when a change touches JSX rendering, remote content display, `dangerouslySetInnerHTML`, `innerHTML`, markdown, `createElement`, user-controlled `href` or `src` values, or server data that becomes UI content. This skill is aligned to `reactxss.pdf`, so prefer it for frontend rendering reviews even when the change is framed as styling, markdown support, or content formatting.

## Review Workflow

1. Inspect `frontend/start-basic-react-query/src/routes/posts.$postId.tsx`, `frontend/start-basic-react-query/src/routes/posts_.$postId.deep.tsx`, and `frontend/start-basic-react-query/src/routes/api/users.$id.ts` first.
2. Search the touched files for `dangerouslySetInnerHTML`, `innerHTML`, `createElement`, markdown renderers, rich-text components, prop spreading from untrusted objects, and direct assignment to `href` or `src`.
3. Check whether untrusted data stays in plain JSX text, moves into a raw HTML sink, or reaches a scriptable URL sink. React auto-escaping is a good baseline, but it does not sanitize arbitrary HTML or URLs.
4. If HTML rendering is required, require an explicit sanitization boundary such as DOMPurify or an SSR-safe equivalent and prefer a dedicated wrapper component over inline `{__html: ...}` objects.
5. Review untrusted URLs with an allowlist mindset. React warnings about `javascript:` URLs are not a sanitizer, and `data:` URLs can also be dangerous in some sinks.
6. Check whether server routes return structured data or HTML fragments, and ensure user-controlled props objects are not spread into elements where they can smuggle `dangerouslySetInnerHTML`.
7. If the current implementation relies on plain JSX text rendering, record that as `Not Present` for raw HTML sinks. If a risky sink is introduced, require a focused test.

## Current Repo Focus

- `frontend/start-basic-react-query/src/routes/posts.$postId.tsx` renders fetched post title and body as plain JSX text.
- `frontend/start-basic-react-query/src/routes/posts_.$postId.deep.tsx` renders the same data pattern and is another XSS review surface.
- `frontend/start-basic-react-query/src/routes/api/users.$id.ts` returns structured JSON rather than HTML, which reduces exposure unless future rendering changes consume it unsafely.

## Output Format

### Analysis & Remediation Checklist

| # | Check | Status | Finding | Fix Applied |
|---|-------|--------|---------|-------------|
| 1 | Dangerous sink scan (`dangerouslySetInnerHTML`, `innerHTML`, `createElement`) | ✅ / ⚠️ / ❌ / — | | |
| 2 | Untrusted data flow: plain JSX text vs. raw HTML sink | ✅ / ⚠️ / ❌ / — | | |
| 3 | Sanitization boundary (DOMPurify or SSR-safe equivalent) | ✅ / ⚠️ / ❌ / — | | |
| 4 | URL allowlist (`javascript:`, `data:` blocked in `href`/`src`) | ✅ / ⚠️ / ❌ / — | | |
| 5 | Server routes: structured JSON vs. HTML fragments | ✅ / ⚠️ / ❌ / — | | |
| 6 | Prop spreading: no untrusted `dangerouslySetInnerHTML` smuggling | ✅ / ⚠️ / ❌ / — | | |
| 7 | Overall: raw HTML rendering present? | ✅ / Not Present | | |

> Fill one status per row: **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable.  
> For each ❌ or ⚠️, describe the fix in the last column (or "pending" if unresolved).

### Findings

- Severity:
- Issue:
- Evidence:
- Recommendation:

### Gaps

- Missing sanitization or renderer details that limit confidence.

### Not Present

- List raw-HTML or scriptable rendering paths that are absent from the current repo.

### Follow-up Checks

- Additional components, renderers, or URLs to inspect if richer content support is added later.

### Source Relevance

- Briefly note which `reactxss.pdf` concerns are actually in play: auto-escaped text binding, dangerous HTML sinks, URL sanitization, DOMPurify boundaries, createElement prop smuggling, or none.

## Not Present Rules

- If no `dangerouslySetInnerHTML`, `innerHTML`, or unsafe `href` or `src` assignment exists, say `Not Present: raw HTML sinks are not implemented in the current frontend.`
- Do not treat plain text JSX rendering as an XSS finding by itself.
- If the code only renders strings as text nodes, keep the report evidence-based and narrow.
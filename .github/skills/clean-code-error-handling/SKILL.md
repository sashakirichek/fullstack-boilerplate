---
name: clean-code-error-handling
description:
  Review error handling, null safety, and third-party boundary isolation in changed code. Use whenever a PR adds try /
  catch blocks, error returns, null checks, optional chaining, or integrates a new external library or API. Covers Clean
  Code chapters 7 (Error Handling) and 8 (Boundaries). Be thorough — trace every error path and spend tokens generously
  on analysis.
argument-hint: '[files, PR, or module to review]'
user-invocable: true
disable-model-invocation: true
---

# Clean Code — Error Handling & Boundaries Review

## When to Use

Use this skill after any change that introduces error handling logic, external service calls, new library imports, or
null/undefined guards. Also use when a reviewer flags swallowed exceptions, missing error context, null returns, or
direct third-party calls scattered through business code. This skill is aligned to Robert C. Martin's _Clean Code_
chapters 7 (Error Handling) and 8 (Boundaries).

## Review Workflow

1. **Error path inventory.** List every `try/catch`, `.catch()`, error callback, and error-returning branch in the diff.
2. **Context in errors.** For each throw or reject: does the error message include what operation failed and enough
   context for the caller to act? Flag throws with empty messages, generic "Something went wrong", or raw library errors
   passed through without context.
3. **No null returns.** Flag functions that return `null` or `undefined` as a failure signal instead of throwing or
   returning an empty collection / `Option` type. Flag callers that must null-check before using a return value.
4. **No null arguments.** Flag functions that accept `null` as a valid parameter and branch internally. Prefer separate
   functions or default values.
5. **Swallowed errors.** Flag empty `catch` blocks, `.catch(() => {})`, or error callbacks that do nothing. Every error
   path should either recover meaningfully, re-throw with context, or log at an appropriate level.
6. **Boundary isolation.** For each new third-party import in the diff: is the library called directly from business
   logic, or is it isolated behind an adapter / wrapper? Direct calls should be confined to a thin integration layer so
   the library can be swapped or mocked easily.
7. **Report.** Fill the checklist. For each ⚠️ or ❌, include file, line, the problematic pattern, and a concrete fix.
   List every instance.

## Current Repo Focus

- `backend/node-express-backend/src/server.ts` — route error responses (`400`, `404`).
- `backend/node-express-backend/src/auth/passport.ts` — `try/catch` in `deserializeUser` and strategy callback.
- `backend/node-express-backend/src/auth/routes.ts` — error callbacks in `logout` and `session.destroy`.
- `backend/node-express-backend/src/auth/session-store.ts` — `.catch` chains in every D1 operation; swallowed error in
  `maybeCleanup`.
- `backend/node-express-backend/src/worker.ts` — top-level `catch` returns 500.
- `frontend/start-basic-react-query/src/utils/posts.tsx` — `.catch` in `fetchPost` that maps 404 to `notFound()`.
- `frontend/start-basic-react-query/src/utils/users.tsx` — `.catch` that throws generic error.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                  | Status           | Finding | Fix Applied |
| --- | ------------------------------------------------------ | ---------------- | ------- | ----------- |
| 1   | Errors include operation context (what failed and why) | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | No null/undefined returned as error signal             | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | No null accepted as function argument                  | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | No swallowed errors (empty catch / ignored callback)   | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | Third-party calls isolated behind adapter / wrapper    | ✅ / ⚠️ / ❌ / — |         |             |

> **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable. For each ⚠️ or ❌ list every instance with file, line,
> pattern, and suggested fix.

### Findings

- Location:
- Pattern:
- Issue:
- Suggested fix:

### Not Present

- If error handling is clean and all boundaries are properly wrapped, say so explicitly.

---
name: clean-code-functions
description:
  Review function size, responsibility, argument count, abstraction levels, and class cohesion in changed code. Use
  whenever a PR adds or modifies functions, methods, classes, or modules, or when a reviewer flags a long function, god
  class, mixed abstraction levels, or too many parameters. Covers Clean Code chapters 3 (Functions) and 10 (Classes). Be
  thorough — walk every function body and spend tokens generously on analysis.
argument-hint: '[files, PR, or module to review]'
user-invocable: true
disable-model-invocation: true
---

# Clean Code — Functions & Class Structure Review

## When to Use

Use this skill after any change that adds, extends, or restructures functions, methods, or classes. Also use when a
reviewer flags long functions, mixed responsibilities, functions with many arguments, or bloated classes. This skill is
aligned to Robert C. Martin's _Clean Code_ chapters 3 (Functions) and 10 (Classes).

## Review Workflow

1. **Inventory.** List every new or modified function/method in the diff with its line count and argument count.
2. **Single responsibility.** For each function ask: _can I describe what this function does without using "and"?_ If
   not, identify the separate responsibilities and propose extraction points.
3. **Size.** Flag functions longer than ~20 lines. For each, identify logical sections that could become named helpers.
4. **Abstraction level.** Within each function, check whether high-level orchestration and low-level detail are mixed.
   The top of a function should read like a story of _what_ happens; implementation details belong in extracted helpers.
5. **Arguments.** Flag functions with more than 3 parameters. Propose a parameter object or split into focused
   functions. Flag boolean "flag" arguments that toggle behaviour — these should be separate functions.
6. **Side effects.** Check whether functions that return values also mutate external state. Prefer either commanding
   (void + side effect) or querying (return value, no mutation), not both.
7. **Class cohesion.** For each changed class: do all methods use most of the class's fields? If a subset of methods
   clusters around a subset of fields, that cluster is a candidate for extraction into a new class.
8. **Report.** Fill the checklist. For each ⚠️ or ❌, include function name, file, line count, and a concrete
   extract/rename/split suggestion. List every instance — do not summarise.

## Current Repo Focus

- `backend/node-express-backend/src/server.ts` — `createApp` wires middleware + routes in one function.
- `backend/node-express-backend/src/auth/passport.ts` — `configurePassport` configures serialisation + strategy.
- `backend/node-express-backend/src/auth/session-store.ts` — `D1SessionStore` class with CRUD + cleanup methods.
- `backend/node-express-backend/src/auth/routes.ts` — `createAuthRouter` with 4 route handlers.
- `backend/node-express-backend/src/worker.ts` — `fetch` handler builds mock req/res objects inline.
- `frontend/start-basic-react-query/src/utils/posts.tsx` — `fetchPosts`, `fetchPost`, query factories.
- `frontend/start-basic-react-query/src/routes/__root.tsx` — `RootDocument` render function.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                 | Status           | Finding | Fix Applied |
| --- | ----------------------------------------------------- | ---------------- | ------- | ----------- |
| 1   | Every function does one thing (single responsibility) | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | Functions ≤ ~20 lines                                 | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | One level of abstraction per function                 | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | ≤ 3 arguments; no boolean flag arguments              | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | No mixed command/query (side effects + return value)  | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | Classes are cohesive; no god class patterns           | ✅ / ⚠️ / ❌ / — |         |             |

> **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable. For each ⚠️ or ❌ list every instance with file,
> function name, line count, and suggested refactor.

### Findings

- Function:
- Location:
- Lines / Args:
- Issue:
- Suggested refactor:

### Not Present

- If all functions are small, focused, and well-structured, say so explicitly.

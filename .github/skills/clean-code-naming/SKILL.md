---
name: clean-code-naming
description:
  Review naming quality, comment hygiene, and formatting consistency in changed code. Use whenever a PR introduces new
  functions, variables, types, files, or modules, or when a reviewer notices unclear names, stale comments, or
  inconsistent formatting. Covers Clean Code chapters 2 (Meaningful Names), 4 (Comments), and 5 (Formatting). Be
  thorough — read every changed symbol and spend tokens generously on analysis.
argument-hint: '[files, PR, or module to review]'
user-invocable: true
disable-model-invocation: true
---

# Clean Code — Naming, Comments & Formatting Review

## When to Use

Use this skill after any change that adds or renames functions, variables, types, constants, files, or modules. Also use
it when a reviewer flags unclear intent, misleading abbreviations, noisy comments, or inconsistent formatting. This
skill is aligned to Robert C. Martin's _Clean Code_ chapters 2, 4, and 5.

## Review Workflow

1. **Collect scope.** Identify every new or renamed symbol in the changed files. Include function names, parameter
   names, type aliases, constants, file names, and exported module members.
2. **Intent check.** For each symbol ask: _does the name answer why it exists, what it does, and how it is used?_ Flag
   names that require a comment to explain, use single letters outside tiny loop indices, or rely on type prefixes /
   Hungarian notation. Propose a better name for each flag.
3. **Pronounceability & searchability.** Flag names a reviewer cannot say aloud in a code review or that collide with
   dozens of unrelated grep hits. Abbreviated names must be widely understood within the domain (e.g. `URL`, `DB`).
4. **Domain vs. solution names.** Business concepts should use ubiquitous domain language; implementation details (data
   structures, patterns) should use recognised solution vocabulary. Flag mismatches.
5. **Comment audit.** For every comment in the diff: can the comment be deleted if the code is renamed or extracted?
   Keep only intent comments (why, not what), legal headers, and genuinely unavoidable clarifications. Flag
   commented-out code for deletion.
6. **Formatting & ordering.** Verify vertical spacing between logical groups, consistent method ordering (public →
   private or lifecycle → API → helpers), and that the project formatter has been applied. Flag formatting
   inconsistencies.
7. **Report.** Fill the checklist below. For each ⚠️ or ❌, include the symbol, file location, and a concrete rename or
   fix suggestion. Be generous with token budget — list every instance, do not summarise with "and others".

## Current Repo Focus

- `backend/node-express-backend/src/server.ts` — `createApp`, `AppConfig`, `AuthConfig`, route handlers.
- `backend/node-express-backend/src/auth/passport.ts` — `configurePassport`, `PassportConfig`, `AuthUser`.
- `backend/node-express-backend/src/auth/routes.ts` — `createAuthRouter`, route path constants.
- `backend/node-express-backend/src/auth/session-store.ts` — `D1SessionStore` class and method names.
- `frontend/start-basic-react-query/src/utils/posts.tsx` — `fetchPosts`, `fetchPost`, query-option factories.
- `frontend/start-basic-react-query/src/utils/users.tsx` — `User` type, query-option factories.
- `frontend/start-basic-react-query/src/routes/__root.tsx` — `RootComponent`, `RootDocument`, nav links.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                         | Status           | Finding | Fix Applied |
| --- | --------------------------------------------- | ---------------- | ------- | ----------- |
| 1   | All new names reveal intent                   | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | Names are pronounceable and searchable        | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | Domain vs. solution vocabulary used correctly | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | No misleading abbreviations or type-encoding  | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | Comments explain _why_, not _what_            | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | No commented-out code in the diff             | ✅ / ⚠️ / ❌ / — |         |             |
| 7   | Formatting consistent; formatter applied      | ✅ / ⚠️ / ❌ / — |         |             |

> **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable. For each ⚠️ or ❌ list every instance with file, line,
> current name, and suggested fix.

### Findings

- Symbol:
- Location:
- Issue:
- Suggested rename / fix:

### Not Present

- If all names are clear, comments are appropriate, and formatting is clean, say so explicitly.

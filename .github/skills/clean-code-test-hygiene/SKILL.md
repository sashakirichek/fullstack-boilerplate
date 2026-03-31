---
name: clean-code-test-hygiene
description:
  Review test quality, structure, and reliability in changed or new tests. Use whenever a PR adds, modifies, or deletes
  tests, or when a reviewer flags flaky tests, slow suites, unclear assertions, or missing coverage for critical paths.
  Covers Clean Code chapter 9 (Unit Tests) and the F.I.R.S.T. principles. Be thorough — read every test body and spend
  tokens generously on analysis.
argument-hint: '[test files, PR, or module to review]'
user-invocable: true
disable-model-invocation: true
---

# Clean Code — Test Hygiene Review

## When to Use

Use this skill after any change that adds, modifies, or removes test files. Also use when a reviewer flags unclear test
names, flaky runs, slow suites, tests with multiple unrelated assertions, or missing edge-case coverage. This skill is
aligned to Robert C. Martin's _Clean Code_ chapter 9 (Unit Tests) and the F.I.R.S.T. principles (Fast, Independent,
Repeatable, Self-validating, Timely).

## Review Workflow

1. **Test inventory.** List every new or modified test case in the diff with its name and the module it covers.
2. **Naming.** Each test name should read like a sentence describing the expected behaviour, e.g.
   `shouldReturn404WhenPostNotFound`. Flag cryptic names like `test1` or `it works`.
3. **One concept per test.** Flag tests that assert multiple unrelated behaviours. Each test should verify one logical
   concept so failures pinpoint the problem.
4. **F.I.R.S.T. check.**
   - **Fast:** Flag tests that hit real network, real databases, or sleep/timeout. Unit tests must run in-process.
   - **Independent:** Flag tests that depend on execution order or shared mutable state from other tests.
   - **Repeatable:** Flag tests that depend on wall-clock time, random data without a seed, or environment variables
     that vary between machines.
   - **Self-validating:** Flag tests with no assertions or that require manual inspection of output.
   - **Timely:** Flag critical code paths in the diff that have no corresponding test.
5. **Arrange-Act-Assert.** Each test should have a clear setup, a single action, and focused assertions. Flag tests
   where these phases are interleaved or where setup is duplicated across tests without a shared helper.
6. **Coverage of changed code.** For each function or branch added in the PR, verify a test exercises it. If no test
   exists, flag the gap and suggest a minimal test case.
7. **Report.** Fill the checklist. For each ⚠️ or ❌, include test name, file, and a concrete fix suggestion. List every
   instance.

## Current Repo Focus

- `backend/node-express-backend/src/__tests__/server.test.ts` — Jest tests for Express routes (`GET /`).
- `frontend/start-basic-react-query/src/__tests__/seo.test.ts` — Vitest tests for SEO utility.
- Backend uses Jest (`jest.config.js`); frontend uses Vitest (`vitest.config.ts`).
- Auth routes (`/auth/google`, `/auth/me`, `POST /auth/logout`) currently have no tests.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                  | Status           | Finding | Fix Applied |
| --- | ------------------------------------------------------ | ---------------- | ------- | ----------- |
| 1   | Test names describe expected behaviour                 | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | One concept per test                                   | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | Fast — no real I/O in unit tests                       | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | Independent — no shared mutable state or ordering deps | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | Repeatable — deterministic across environments         | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | Self-validating — explicit assertions in every test    | ✅ / ⚠️ / ❌ / — |         |             |
| 7   | Critical paths in the diff have test coverage          | ✅ / ⚠️ / ❌ / — |         |             |

> **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable. For each ⚠️ or ❌ list every instance with test name,
> file, and suggested fix.

### Findings

- Test:
- Location:
- Issue:
- Suggested fix:

### Not Present

- If all tests are clean, fast, focused, and cover the changed code, say so explicitly.

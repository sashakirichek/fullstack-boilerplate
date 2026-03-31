---
name: gdpr-compliance-check
description:
  Review personal data handling, consent, retention, and data-subject rights in this repo. Use whenever changes collect,
  store, log, or transmit personal data such as names, emails, IP addresses, user IDs, analytics events, or tracking
  identifiers, even if the user only mentions a form, user profile, database migration, or logging change.
argument-hint: '[feature, route, or files to review]'
user-invocable: true
disable-model-invocation: true
---

# GDPR Compliance Check

## When to Use

Use this skill when a change introduces or modifies personal data collection, storage, logging, transmission, or
deletion paths. This includes database schemas that hold user-identifiable fields, server logs that record IP addresses
or user agents, analytics or tracking integrations, email collection forms, cookie consent flows, and any feature that
lets users create accounts or profiles.

## Review Workflow

1. Inspect `backend/node-express-backend/src/server.ts`, `backend/node-express-backend/src/worker.ts`,
   `frontend/start-basic-react-query/src/routes/api/users.ts`,
   `frontend/start-basic-react-query/src/routes/api/users.$id.ts`, and any new migration files under
   `backend/node-express-backend/migrations/` or schema changes in `backend/node-express-backend/prisma/schema.prisma`.
2. Identify every field that qualifies as personal data: name, email, IP address, user agent, device ID, geolocation,
   cookies tied to a person, or any combination that can single out an individual.
3. For each personal data field, verify there is a documented lawful basis (consent, contract, legitimate interest, or
   legal obligation) and that the purpose is explicit and limited.
4. Check that data minimization is respected: only collect fields the feature actually needs, avoid logging personal
   data at debug or info level, and do not copy personal data into caches, search indexes, or analytics pipelines
   without review.
5. Review data-subject rights support: can a user request access to, correction of, or deletion of their personal data?
   If deletion is supported, verify it cascades through backups, logs, and third-party integrations.
6. Check data retention: personal data should have a defined lifetime or cleanup mechanism. Look for unbounded growth of
   user tables, log files, or session stores.
7. If personal data crosses a network boundary (third-party API, CDN, analytics service, or cross-border transfer),
   verify the data processing agreement is acknowledged and the transfer mechanism is documented.
8. If the repo does not collect or store personal data, report `Not Present` instead of speculating.

## Current Repo Focus

- `backend/node-express-backend/prisma/schema.prisma` defines the data model. Currently it has a `posts` table with no
  personal data fields.
- `backend/node-express-backend/src/server.ts` serves posts endpoints and does not collect user-identifiable input.
- `backend/node-express-backend/src/worker.ts` forwards requests and may see IP addresses or user agents in headers, but
  does not persist them.
- `frontend/start-basic-react-query/src/routes/api/users.ts` and `users.$id.ts` proxy public sample data from
  JSONPlaceholder and do not store personal data locally.
- `backend/node-express-backend/migrations/` contains schema migrations that would be the first place personal data
  columns appear.

## Output Format

### Analysis & Remediation Checklist

| #   | Check                                                              | Status           | Finding | Fix Applied |
| --- | ------------------------------------------------------------------ | ---------------- | ------- | ----------- |
| 1   | Personal data field inventory (names, emails, IPs, identifiers)    | ✅ / ⚠️ / ❌ / — |         |             |
| 2   | Lawful basis & purpose limitation documented                       | ✅ / ⚠️ / ❌ / — |         |             |
| 3   | Data minimization (no unnecessary collection, logging, or copying) | ✅ / ⚠️ / ❌ / — |         |             |
| 4   | Data-subject rights (access, rectification, deletion, portability) | ✅ / ⚠️ / ❌ / — |         |             |
| 5   | Data retention & cleanup lifecycle                                 | ✅ / ⚠️ / ❌ / — |         |             |
| 6   | Third-party & cross-border transfer review                         | ✅ / ⚠️ / ❌ / — |         |             |
| 7   | Consent mechanism (where consent is the lawful basis)              | ✅ / ⚠️ / ❌ / — |         |             |
| 8   | Overall: personal data processing present?                         | ✅ / Not Present |         |             |

> Fill one status per row: **✅** pass, **⚠️** warning, **❌** fail, **—** not applicable. For each ❌ or ⚠️, describe
> the fix in the last column (or "pending" if unresolved).

### Findings

- Severity:
- Issue:
- Evidence:
- Recommendation:

### Gaps

- Missing documentation, policies, or implementation details that prevent a stronger conclusion.

### Not Present

- List personal data processing mechanisms that are absent from the current repo.

### Follow-up Checks

- Additional schemas, logs, or integrations to inspect if user-facing features are added later.

## Not Present Rules

- If no personal data is collected, stored, logged, or transmitted, say
  `Not Present: personal data processing is not implemented in the current repo.`
- Do not treat public sample data from JSONPlaceholder or similar test APIs as personal data.
- Do not infer personal data handling from generic CRUD patterns that operate on non-personal content like blog posts.
- If the only personal-data exposure is standard HTTP headers (IP, user agent) passing through without persistence, note
  the transient exposure but do not escalate it to a finding unless the headers are logged or stored.

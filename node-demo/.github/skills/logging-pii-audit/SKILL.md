---
name: logging-pii-audit
description: 'Audit logging calls and PII exposure across TypeScript source files. Use when checking for console.log in production code, unredacted PII fields in logger calls, reversed logger argument order, sensitive data in responses, or direct process.env access outside config. Triggers: "audit logging", "check PII", "find console.log", "logging audit", "sensitive data audit", "check for PII leaks", "audit log calls".'
argument-hint: "Optionally specify a subfolder to scope the audit, e.g. 'src/controllers'"
---

# Logging & PII Audit

Scan TypeScript source files for logging violations and PII exposure. Produce a structured findings report — no edits.

## Scope

Default scan root: `src/`. If the user specifies a subfolder, restrict to that path. Exclude `*.test.ts` and `*.spec.ts` files from checks 1–3 (test files may use `console` freely), but include them in check 4 (PII in responses is always a violation).

---

## Procedure

### Step 1 — Find `console` calls in production code

Search for `console.log|console.error|console.warn|console.debug|console.info` in all non-test `.ts` files under the scan root.

- Flag every match: file path, line number, the offending call.
- Rule: production code must use the shared `logger` from `src/lib/logger.ts`.

### Step 2 — Check logger argument order

Search for `logger.info|logger.warn|logger.error|logger.debug` calls.

For each match, read the surrounding line. The correct form is:

```ts
logger.info({ context }, 'message string')  // ✅ context object first
logger.info('message string', { context })  // ❌ message first — flag it
logger.info('message string')               // ✅ acceptable (no context)
```

Flag any call where the first argument is a string literal and a second argument exists.

### Step 3 — Detect PII / sensitive fields in logger calls

Search logger calls for any of these field names appearing inside the context object:

| Field pattern | Risk |
|---|---|
| `password`, `passwordHash`, `passwd` | Credential |
| `token`, `accessToken`, `refreshToken`, `apiKey`, `secret` | Credential |
| `ssn`, `dob`, `dateOfBirth`, `creditCard`, `cardNumber` | PII |
| `authorization`, `cookie`, `sessionId` | Session |

Flag every match with file, line, and the field name found. Note: the Pino logger redacts `password*` and `authorization` headers automatically, but callers must still not pass them — redundant redaction is not a defence against future logger changes.

### Step 4 — Detect sensitive fields in API responses

Search `res.json(` and `res.send(` calls across all `.ts` files (including controllers). Look for any object literal or variable that includes:

- `passwordHash`, `password`, `token`, `secret`, `apiKey`

Flag if any of these appear to be included in a response payload.

### Step 5 — Find `process.env` outside `src/config.ts`

Search for `process\.env` in all `.ts` files. Flag any match that is **not** in `src/config.ts`. Every environment variable must be read through the `config` module.

---

## Output Format

Respond with only the findings report. No preamble, no commentary.

```
## Logging & PII Audit

### 🔴 PII / Credential Exposure
- `src/file.ts:42` — `passwordHash` passed to logger context.

### 🟡 Logger Misuse
- `src/file.ts:17` — `console.log` in production code.
- `src/file.ts:31` — logger arguments reversed: message string is first.

### 🟡 Config Boundary Violation
- `src/file.ts:8` — `process.env.PORT` read directly outside `src/config.ts`.

### ✅ Clean
- List checks that produced zero findings.
```

Severity guide:
- **🔴 PII / Credential Exposure**: Steps 3 and 4 — data that must never reach logs or responses.
- **🟡 Logger Misuse**: Steps 1, 2, and 5 — convention violations that degrade observability or maintainability.
- If a check is fully clean, list it explicitly under ✅ Clean.

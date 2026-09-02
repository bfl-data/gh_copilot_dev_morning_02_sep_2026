---
applyTo: '**/*.{test,spec}.{ts,js}'
---

When generating or modifying test code, always follow these rules:

## ✅ General Testing Rules
- Follow the **AAA pattern**: Arrange → Act → Assert.
- Write **isolated, deterministic tests** only.
- Do **NOT depend on real databases, APIs, or network calls**.
- Prefer **mocks, stubs, and spies** over real implementations.
- Each test must validate **only one behaviour**.
- Use **descriptive test names** as plain English sentences — no `should` prefix.
  - ✅ `it('returns undefined for an empty array', ...)`
  - ❌ `it('should return undefined for an empty array', ...)`

---

## ✅ Unit Testing Rules
- Mock:
  - External APIs
  - Databases
  - File system
  - Timers and Date
- Avoid testing framework internals.
- No shared state between tests.
- Use `beforeEach` / `afterEach` for setup & cleanup.
- Always assert:
  - Expected output
  - Error conditions
  - Edge cases

---

## ✅ Frontend Component Tests (React / React Native)
- Use:
  - `@testing-library/react`
  - `@testing-library/react-native`
- Prefer **user-event simulation** over implementation testing.
- Always test:
  - Rendering
  - User interaction
  - Accessibility roles
  - Error boundaries (if applicable)
- Avoid testing:
  - Internal state
  - Private methods

---

## ✅ API / Backend Tests
- Validate:
  - HTTP status codes
  - Response schema
  - Error handling
  - Input validation failures
- Use **factory data** instead of hardcoded fixtures.
- Reset mocks and DB state after every test.

---

## ✅ End-to-End (E2E) Tests
- Only cover:
  - Critical business workflows
  - Authentication
  - Order creation / submission
- Never:
  - Re-test unit logic
  - Hardcode credentials
- Use environment variables for secrets.

---

## ✅ Performance & Stability
- Avoid flaky tests:
  - Do NOT use arbitrary `setTimeout`
  - Use explicit waits
- Never suppress failures.
- Keep test execution **fast and parallel-safe**.

---

## ✅ Formatting & Reporting
- Use consistent assertion style.
- Always include failure messages:
  - `expect(value).toBe(expected)`
  - `expect(value).toBeDefined()`
- Group tests using:
  - `describe`
  - `it`
  - `test`

---

## ✅ Strict Prohibitions
❌ No disabled tests  
❌ No snapshot-only validation for logic  
❌ No console logs  
❌ No hard-coded auth tokens  
❌ No real production data  

---

## ✅ Output Requirements for Copilot
Whenever generating tests:
- Include:
  - ✅ Happy path
  - ✅ Failure path
  - ✅ Edge case
- Use **clear variable naming**
- Use **explicit mocks**

---
name: vitest-generate
description: 'Generate Vitest unit tests for a TypeScript source file in this project. Use when asked to write tests, add tests, create a test file, generate specs, cover a function, or test a service/controller/utility/schema. Triggers: "write tests", "generate tests", "add unit tests", "test this file", "cover this function", "create test file", "add vitest tests".'
argument-hint: "Path to the source file to test, e.g. 'src/services/my-service.ts'"
---

# Vitest Test Generator

Generate a `*.test.ts` file alongside the source file, following this project's Vitest conventions. Write tests only — do not modify the source file.

---

## Step 1 — Read the Source File

Read the target file in full. Identify:

- Every **exported function, class, or object** — these are the test subjects.
- **Dependencies imported** from other modules — these need to be mocked.
- **Async functions** — require `await` in tests.
- **Thrown errors** — must be tested with `expect(...).rejects.toThrow(...)` or `try/catch`.
- The **module type** — determines the mocking strategy (see Step 2).

---

## Step 2 — Choose a Mocking Strategy

| Module type | How to identify | Mocking approach |
|---|---|---|
| **Utility** | Pure functions, no imports from `src/` | No mocks needed |
| **Service** | Imports from `src/lib/`, `src/services/`, or external packages | Mock external packages with `vi.mock(...)` |
| **Controller** | Imports `Request`, `Response` from `express` | Mock `req`/`res` with typed objects; mock called services with `vi.mock(...)` |
| **Schema** | Zod schema exports | No mocks; test `.parse()` with valid + invalid inputs |

---

## Step 3 — Write the Test File

### File location and name
Place the test file **alongside** the source: if source is `src/services/foo.ts`, test is `src/services/foo.test.ts`.

### Import conventions
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myExport } from './my-module.js'; // .js extension required
```

Only import `vi` and `beforeEach` if the file actually uses mocks.

### Structure: one `describe` block per exported symbol
```ts
describe('exportedFunctionName', () => {
  it('description of the expected behaviour', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Naming rules
- `describe` label = the exported name, e.g. `describe('hashPassword', ...)`.
- `it` label = a plain English sentence describing the outcome, **no leading "should"**.
  - ✅ `it('returns undefined for an empty array', ...)`
  - ❌ `it('should return undefined for an empty array', ...)`
- One behaviour per `it` block.

### AAA pattern
Every test must have the three phases, separated by blank lines when the Arrange step is non-trivial:
```ts
it('returns the hashed value', async () => {
  const input = 'plaintext';

  const result = await hashPassword(input);

  expect(result).not.toBe(input);
  expect(result).toBeTruthy();
});
```

### Mocking with `vi.mock`
```ts
vi.mock('../lib/logger.js'); // hoist mock before imports

describe('myService', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // reset between tests
  });
  // ...
});
```

Use `vi.fn()` for individual spy functions. Reset mocks in `beforeEach`.

### Async tests
```ts
it('rejects with an error for invalid input', async () => {
  await expect(myAsyncFn('bad')).rejects.toThrow('expected message');
});
```

---

## Step 4 — Required Test Coverage

For every exported function, cover **all** of the following that apply:

| Category | Examples |
|---|---|
| Happy path | Expected inputs produce expected outputs |
| Empty / zero inputs | Empty string, empty array, 0 |
| Boundary values | Min/max lengths, limit values |
| Invalid inputs | Wrong type handled by Zod schema, missing required fields |
| Error / rejection paths | Functions that throw or reject |
| Mock call assertions | `expect(mockFn).toHaveBeenCalledWith(...)` where call args matter |

---

## Step 5 — Validate Before Finishing

After writing the test file, check:

- [ ] Every exported symbol from the source has at least one `describe` block.
- [ ] No test imports from `jest` — only `vitest`.
- [ ] All local imports use `.js` extensions.
- [ ] No `console.log` in test code.
- [ ] No shared mutable state between `it` blocks (use `beforeEach` to reset).
- [ ] Async functions are `await`-ed; sync functions are not.

---

## Output

Write the complete test file content. Then state:
- How many `it` blocks were generated.
- Any exported symbols that were **skipped** and why (e.g. private helper not worth mocking).
- Any gaps in coverage the user should be aware of.

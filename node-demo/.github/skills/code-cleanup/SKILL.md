---
name: code-cleanup
description: 'Perform behavior-preserving code cleanup: remove dead code and unused imports, simplify complex control flow and duplicated logic, improve naming consistency and readability, and make safe maintainability refactors. Use when: code cleanup, refactor for readability, remove unused code, dead code removal, simplify control flow, reduce duplication, naming cleanup, maintainability refactor, or no-feature-change refactor.'
argument-hint: 'Describe the files, module, or cleanup goal.'
---

# Code Cleanup

Improve maintainability without changing features, public contracts, externally observable behavior, or intentionally supported compatibility paths.

## When to Use

- Remove unused imports, unreachable branches, obsolete helpers, and unused local code.
- Simplify hard-to-follow conditionals, nesting, or duplicate logic.
- Improve inconsistent names and local readability.
- Make a small, behavior-preserving refactor in an existing codebase.

## Guardrails

- Start at the requested file, symbol, failing lint/typecheck finding, or a targeted usage search.
- Preserve public APIs, data formats, error behavior, side-effect order, logging, and performance characteristics unless the request explicitly changes them.
- Treat apparently unused exported code, framework hooks, configuration, scripts, generated entry points, reflection, and dynamic imports as potentially live until usage is verified.
- Keep cleanup separate from feature work. Do not change behavior to make code look tidier.
- Respect the repository's existing conventions, formatting, architecture, and test style.
- Keep each edit narrowly scoped and reversible. Do not combine unrelated cleanup opportunities in one change.

## Procedure

1. Identify one concrete cleanup target and read only its local implementation, direct callers, and nearby tests.
2. State a falsifiable hypothesis, such as: "this import has no runtime or type usage" or "these branches return the same result for every input." Name the cheapest check that could disprove it.
3. Classify the change:
   - **Mechanical:** unused import, unused local, unreachable code proven by types or control flow, or a pure rename with verified references.
   - **Structural:** extraction, deduplication, conditional rewrite, control-flow simplification, or meaningful naming change.
4. For mechanical cleanup, make the smallest removal or semantics-aware rename. For structural cleanup, preserve branch order, short-circuiting, exceptions, mutations, and return values; add or update focused tests first when the current tests do not capture the behavior.
5. Immediately run the cheapest focused validation: the relevant test, typecheck, lint command, or build check. Repair the same slice and rerun the check if it fails.
6. Inspect the diff for accidental API changes, broadened scope, formatting churn, and removed code with external references.
7. Repeat from step 1 for the next independent target. Finish with the repository's applicable verification command when practical.

## Decision Points

### Is the code actually dead?

- Search direct and indirect references before removing it.
- If usage is dynamic or cannot be established, retain it and report the uncertainty rather than deleting it.
- If the compiler or linter proves it unused, remove it and validate the affected module.

### Can duplicate logic be merged safely?

- Merge only when inputs, outputs, errors, side effects, execution order, and performance expectations match.
- Keep separate implementations when their similarity masks different domain meanings or future extension points.
- Prefer a small shared helper only when it removes meaningful duplication without obscuring the calling code.

### Is a control-flow rewrite safe?

- Preserve evaluation order and short-circuit behavior.
- Keep validation and authorization checks before dependent work.
- Avoid compact expressions that hide mutations, error paths, or resource cleanup.

### Should a symbol be renamed?

- Rename when the new name materially improves precision and matches local conventions.
- Use language-server rename tooling when available; otherwise verify imports, exports, tests, docs, serialization keys, and string-based references.
- Do not rename public or serialized identifiers without explicit approval.

## Completion Criteria

- Every removal has a verified absence of live usage or compiler/linter evidence.
- Behavior-sensitive cleanup has focused tests covering the preserved branch or contract.
- Focused validation passes after each edit slice.
- The final diff contains only maintainability changes, with no feature, API, schema, or response changes.
- Any ambiguous candidate or unverified dynamic usage is documented as a follow-up rather than changed.
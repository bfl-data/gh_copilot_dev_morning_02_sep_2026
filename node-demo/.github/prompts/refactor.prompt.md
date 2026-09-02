---
agent: agent
description: Refactor the active file for best practices
---

Refactor the currently open file with a behavior-preserving approach.

Goals:
- Improve readability
- Improve performance where safe
- Improve security posture
- Improve maintainability

Hard constraints:
- Do NOT change functionality or public behavior
- Keep API contracts and I/O unchanged
- Do not introduce unnecessary dependencies
- Preserve compatibility with the existing project standards

Execution flow:
1. Identify refactor opportunities with the highest clarity-to-risk benefit
2. Apply minimal, focused edits
3. Verify behavior is unchanged (inputs, outputs, side effects)
4. Keep the diff small and easy to review

Refactor checklist:
1. Simplify complex logic and reduce duplication
2. Improve naming consistency and code organization
3. Remove dead or redundant code paths
4. Add concise comments only where logic is non-obvious
5. Prefer safer defaults and defensive coding patterns

Output expectations:
- Provide minimal, focused edits
- Keep diffs easy to review
- Avoid unrelated formatting churn
- Do not mix refactoring with feature work
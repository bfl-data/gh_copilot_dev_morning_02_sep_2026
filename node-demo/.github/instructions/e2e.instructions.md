---
applyTo: "e2e/**/*.ts"
description: "Instructions for end-to-end test files (no e2e suite exists in this repo yet — applies once one is added under e2e/)"
---

# E2E Testing Instructions

## Overview
End-to-end (E2E) testing guidelines for testing complete user workflows and application flows.

## Best Practices
- Test critical user paths and workflows
- Use meaningful test descriptions
- Keep tests isolated and independent
- Clean up test data after execution
- Use explicit waits instead of hard sleeps
- Avoid testing implementation details

## Test Structure
- Setup: Prepare test environment and data
- Action: Perform user actions
- Assert: Verify expected outcomes
- Teardown: Clean up resources

## Common Patterns
- Page Object Model for better maintainability
- Parameterized tests for multiple scenarios
- Consistent naming conventions
- Comprehensive error handling

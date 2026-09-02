---
applyTo: "e2e/**/*.ts"
description: "Instructions for Playwright test files (Playwright is not installed in this repo yet — applies once @playwright/test is added and tests live under e2e/)"
---

# Playwright Testing Instructions

## Overview
Guidelines for writing and maintaining Playwright tests for browser automation and testing.

## Setup
- Install Playwright: `npm install -D @playwright/test`
- Configure `playwright.config.ts` with appropriate settings
- Use browser contexts for test isolation
- Configure multiple browser types (Chromium, Firefox, WebKit)

## Best Practices
- Use locators instead of hard-coded selectors
- Implement auto-waiting for better reliability
- Use fixtures for common setup/teardown
- Run tests in parallel when possible
- Configure appropriate timeouts
- Use mobile and desktop configurations

## Test Organization
- Group related tests in describe blocks
- Use hooks (beforeEach, afterEach) for setup/cleanup
- Implement custom fixtures for reusable logic
- Keep test files focused and manageable

## Debugging
- Use `page.pause()` for step-by-step debugging
- Run with `--debug` flag for interactive mode
- Use trace files for post-mortem analysis
- Check screenshots and videos for failures

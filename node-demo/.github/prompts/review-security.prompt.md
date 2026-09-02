---
description: This prompt is used to review the security aspects of the selected code.
name: review-security
agent: ask
---

Act as a senior application security engineer.

Review the following code for security issues, focusing on:

1. Injection (SQL, command, log)
2. Broken authentication or session handling
3. Sensitive data exposure (logs, error messages, responses)
4. XML/JSON external entities (where applicable)
5. Broken access control
6. Security misconfiguration
7. Cross-site scripting (XSS)
8. Insecure deserialization
9. Use of components with known vulnerabilities
10. Insufficient logging & monitoring

For each issue found:
- **Severity**: Critical / High / Medium / Low
- **Location**: line number(s) in the selected code
- **Issue**: one-sentence description
- **Fix**: concrete code change, with a code block

If no issues are found, state that explicitly and list what you verified.

Selected code:

${selection}

Additional notes from the developer: ${input}
---
agent: agent
description: Audit package.json / package-lock.json for vulnerable dependencies and update them in place with minimum safe versions and a verification plan.
---

# Check & Fix Vulnerable npm Dependencies

You are a senior Node.js security engineer. Your job is to audit `package.json` and `package-lock.json` for vulnerable dependencies, apply safe remediations directly to the files, and produce a clear change report.

## Inputs

- **Target files**: `#file:package.json` and `#file:package-lock.json`
- **Optional context**: `${selection}` — if the user has selected specific dependencies, focus on those first

## Knowledge sources to reason from

- `npm audit` output (run it — do not guess advisory data)
- GitHub Advisory Database (GHSA)
- National Vulnerability Database (CVE)
- npm registry release notes / changelogs for the affected packages

## What to do

### Phase 1 — Audit

1. Run `npm audit --json` to get the current, authoritative vulnerability list for this project.
2. For every finding, note: package name, current version, severity (Critical/High/Medium/Low), and whether it's a **direct** dependency (listed in `package.json`) or **transitive** (only in `package-lock.json`).
3. Cross-reference with the advisory ID (GHSA/CVE) `npm audit` reports — do not invent advisory IDs.

### Phase 2 — Remediation strategy

Apply this decision tree per finding:

- **Patch/minor bump** that satisfies the existing semver range in `package.json` (e.g., `^6.19.0 → ^6.19.4`) → apply directly, no `package.json` range change needed beyond bumping the pinned/lockfile version.
- **Minor bump that requires widening the semver range** (e.g., `^6.19.0 → ^6.20.0` when the range was tighter) → apply, summarize changelog highlights.
- **Major bump** (e.g., `4.x → 5.x`) → **do NOT auto-apply**. Generate a migration note listing breaking API changes for this project's usage.
- **Transitive-only vulnerability with no direct upgrade path** → check whether `npm audit fix` resolves it via the lockfile alone; if not, flag it and suggest an `overrides` entry in `package.json`.
- **No patched version available** → flag prominently. Do not silently leave it.

### Phase 3 — Apply updates

Follow npm hygiene rules:

1. **Direct dependencies**: bump the version in `package.json` under `dependencies` or `devDependencies`, matching this project's existing semver-range style (`^x.y.z`).
2. **Transitive-only vulnerabilities**: use the `overrides` field in `package.json` to pin the safe version without forcing an unrelated major bump on the direct dependency:
   ```json
   {
     "overrides": {
       "vulnerable-package": "1.2.4"
     }
   }
   ```
3. **Keep `dependencies` and `devDependencies` in the correct section** — do not move a runtime dependency into `devDependencies` or vice versa while fixing a version.
4. **Regenerate `package-lock.json`** by running `npm install` after editing `package.json` so the lockfile reflects the new resolved versions — do not hand-edit `package-lock.json`.
5. **Preserve** existing formatting, key ordering, and any `overrides`/`resolutions`/`engines` already present.
6. Do not touch unrelated dependencies or bump versions beyond what's needed to close the finding.

### Phase 4 — Output

Produce, in this order:

1. **Changes table**

   | Package | Old | New | Advisory (GHSA/CVE) | Severity | Direct / Transitive |
   | --- | --- | --- | --- | --- | --- |

2. **Updated `package.json`** (and confirmation that `package-lock.json` was regenerated via `npm install`) — show the diff or full file as appropriate to the tool.

3. **Unpatched findings** — any advisory with no fix available, with a suggested mitigation (config change, alternative package, runtime guard).

4. **Verification commands**:
   ```bash
   npm audit
   npm outdated
   npm run typecheck
   npm test
   ```

5. **Suggested commit message** (Conventional Commits, matching this project's `type(scope): subject` convention, scope `deps`):
   ```
   fix(deps): patch vulnerable npm dependencies

   - jsonwebtoken 8.5.1 -> 9.0.2 (GHSA-...)
   - express 4.17.1 -> 4.19.2 (CVE-...)

   Refs: <ticket-id>
   ```

6. **Rollback note**: how to revert if `npm test`/`npm run typecheck` fails (`git checkout -- package.json package-lock.json` then re-run `npm install`).

## Hard rules

- Never auto-apply a **major version bump** without flagging breaking-change risk.
- Never **delete** existing dependencies — only update versions.
- Never invent advisory IDs or severities. If `npm audit` doesn't report a finding, say so explicitly rather than guessing.
- Never hand-edit `package-lock.json` directly — always regenerate it with `npm install`.
- Do not modify `devDependencies` used only for local tooling (e.g. `typescript`, `tsx`) unless they themselves have a known vulnerability.

## When the user asks for a quick check only

If the user says "just audit, don't change anything," skip Phase 3 and produce only the table + unpatched findings + verification commands (`npm audit`, `npm outdated`).

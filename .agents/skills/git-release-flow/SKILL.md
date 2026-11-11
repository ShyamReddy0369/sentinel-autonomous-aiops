---
name: git-release-flow
description: >-
  Enforces the Git branch promotion workflow: verify tests, commit, PR/merge changes to 'dev', and promote to 'main' only after flawless verification with zero margin for errors and zero conflicts.
---

# Git Release Flow: Feature -> dev -> main

Whenever changes are made to the codebase, follow this rigorous promotion protocol:

## 1. Quality Gates & Pre-Commit Verification
Before creating any commit or pull request:
- **Backend Tests**: Run `venv\Scripts\python.exe -m pytest` and ensure 100% pass rate.
- **Frontend Linter & Build**: Run `cd frontend; npm run lint; npm run build` and ensure 0 errors and 0 warnings.
- **Diff Inspection**: Run `git status` and `git diff` to ensure no unwanted files or debug artifacts are left behind.

## 2. Stage & Merge to `dev`
- Ensure changes are committed with clear, descriptive commit messages.
- Ensure the `dev` branch is up to date.
- Merge the feature branch into `dev` (or open/merge PR to `dev`).
- Re-run all tests on `dev` to guarantee zero merge regressions.

## 3. Strict Promotion to `main`
- Only proceed to `main` if:
  1. All tests and builds pass on `dev`.
  2. There is zero margin for error (no warnings, no broken links, no syntax flaws).
  3. There are zero merge conflicts with `origin/main`.
- Merge `dev` into `main`.
- Push `main` to the remote repository.

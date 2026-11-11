# Sentinel AI Ops - Project Rules & Git Workflow

Whenever making changes to this codebase:
1. **Pre-flight Litmus Check**:
   - Backend: `venv\Scripts\python.exe -m pytest` must pass 100%.
   - Frontend: `cd frontend; npm run lint; npm run build` must have 0 errors and 0 warnings.
2. **Promote to `dev` first**:
   - Commit all tested changes with standard conventional commits.
   - Merge/PR changes into the `dev` branch.
3. **Zero-Margin Gate for `main`**:
   - Only when `dev` is completely tested, verified, and has zero conflicts and zero errors, merge `dev` into `main`.

# Final Fix for ERR_INVALID_THIS Error on Vercel

## The Problem
The `ERR_INVALID_THIS` error occurs when pnpm 9.x tries to fetch packages from the npm registry. This is a known bug in pnpm 9.x.

## Root Cause
Vercel might be using pnpm 9.x by default, which has this bug. Despite our attempts to force pnpm 8.15.6, Vercel's Turbo detection might be overriding it.

## Solution Applied

### 1. Updated vercel.json
- Forces pnpm 8.15.6 installation using both `corepack` and `npm install -g` as fallback
- Uses `--no-frozen-lockfile` to allow pnpm to handle lockfile compatibility
- Uses `--shamefully-hoist` to flatten node_modules (helps with compatibility)

### 2. Enhanced .npmrc
- Increased timeouts and retries
- Added retry min/max timeouts
- Configured store directory

### 3. Created .pnpmfile.cjs
- Workaround hook for pnpm registry handling

## Alternative Solution: Use npm (If pnpm continues to fail)

If the error persists, switch to npm:

```json
{
  "buildCommand": "cd apps/frontend && npm ci && npm run build",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "apps/frontend/dist"
}
```

Then create `package-lock.json`:
```bash
cd apps/frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json for npm"
```

## Vercel Dashboard Settings

Make sure in Vercel Dashboard:
1. **Root Directory**: Empty (uses repo root)
2. **Framework Preset**: Other
3. **Build Command**: Leave empty (uses vercel.json)
4. **Install Command**: Leave empty (uses vercel.json)
5. **Output Directory**: `apps/frontend/dist`

## Next Steps

1. Commit all changes:
   ```bash
   git add vercel.json .npmrc apps/frontend/.npmrc .pnpmfile.cjs scripts/vercel-install.sh
   git commit -m "Fix ERR_INVALID_THIS: force pnpm 8.15.6 and add workarounds"
   git push
   ```

2. Redeploy on Vercel

3. If it still fails, check the build logs to see which pnpm version is actually being used

4. If pnpm 9.x is still being used, consider the npm fallback solution above


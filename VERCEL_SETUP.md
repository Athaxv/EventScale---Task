# Vercel Deployment Configuration for Vite React Monorepo

## Problem
Vercel is detecting Turbo and trying to use pnpm, but there's a lockfile version mismatch:
- Lockfile version: 6.0 (pnpm 9.x format)
- Package.json specifies: pnpm@8.15.6
- Vercel might be using a different pnpm version

## Solution

### 1. Vercel Dashboard Configuration

Go to your Vercel project settings and configure:

**General Settings:**
- **Root Directory**: Leave empty (or `/`) - Vercel should detect the repo root
- **Framework Preset**: Other

**Build & Development Settings:**
- **Build Command**: `pnpm --filter eventscale build`
- **Output Directory**: `apps/frontend/dist`
- **Install Command**: `corepack enable && corepack prepare pnpm@8.15.6 --activate && pnpm install`
- **Node.js Version**: 20.x (set in `.nvmrc`)

### 2. Alternative: Use vercel.json (Current Setup)

The `vercel.json` at the root is already configured. Make sure:
- Vercel is deploying from the repository root
- The `packageManager` field in `package.json` specifies `pnpm@8.15.6`
- Corepack will automatically use the correct pnpm version

### 3. If Issues Persist

If you still get lockfile errors, try one of these:

**Option A: Regenerate lockfile with pnpm 8.x**
```bash
# Delete lockfile
rm pnpm-lock.yaml
# Install with pnpm 8.15.6 (should create lockfile v5.4)
pnpm install
# Commit and push
git add pnpm-lock.yaml
git commit -m "Regenerate lockfile with pnpm 8.15.6"
git push
```

**Option B: Use npm instead (fallback)**
Update `vercel.json`:
```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build --workspace=apps/frontend"
}
```

**Option C: Update to pnpm 9.x (if compatible)**
```bash
# Update package.json
"packageManager": "pnpm@9.0.0"
# Regenerate lockfile
pnpm install
```

## Current Configuration

- ✅ `vercel.json` at root configured for monorepo
- ✅ `packageManager` set to `pnpm@8.15.6` in package.json
- ✅ `.nvmrc` specifies Node.js 20
- ✅ `.npmrc` configured for network timeouts
- ✅ Build command uses pnpm filter for eventscale app

## Next Steps

1. Commit current changes:
   ```bash
   git add vercel.json .npmrc .nvmrc apps/frontend/.vercelignore
   git commit -m "Configure Vercel for Vite React monorepo deployment"
   git push
   ```

2. In Vercel Dashboard, verify:
   - Root Directory is empty or `/`
   - Build settings match `vercel.json` (or let vercel.json override)

3. Redeploy - should work now!


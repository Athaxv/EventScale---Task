# ============================================
# STAGE 1: Base image with pnpm
# ============================================
FROM node:20-alpine AS base

# Install pnpm (pinned to match lockfile version)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Set working directory
WORKDIR /app

# ============================================
# STAGE 2: Install dependencies
# ============================================
FROM base AS deps

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for workspace packages
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# ============================================
# STAGE 3: Build the application
# ============================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules

# Copy source files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/ ./apps/backend/
COPY packages/db/ ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Build @repo/db (generates Prisma client + compiles TypeScript)
WORKDIR /app/packages/db
RUN pnpm run build

# Build backend
WORKDIR /app/apps/backend
RUN pnpm run build

# ============================================
# STAGE 4: Production image
# ============================================
FROM node:20-alpine AS runner

# Install pnpm for production dependency pruning
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma

# Expose the port (configurable via PORT env)
EXPOSE 3000

# Set working directory to backend
WORKDIR /app/apps/backend

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["node", "dist/index.js"]

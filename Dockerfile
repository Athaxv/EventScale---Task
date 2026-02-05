# ============================================
# STAGE 1: Base image with pnpm
# ============================================
FROM node:20-bookworm AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Install Playwright system dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

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
COPY apps/scraper/package.json ./apps/scraper/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# Install Playwright browsers
RUN npx playwright install chromium

# ============================================
# STAGE 3: Build the application
# ============================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/apps/scraper/node_modules ./apps/scraper/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules

# Copy source files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/ ./apps/backend/
COPY apps/scraper/ ./apps/scraper/
COPY packages/db/ ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Build @repo/db (generates Prisma client + compiles TypeScript)
WORKDIR /app/packages/db
RUN pnpm run build

# Build scraper
WORKDIR /app/apps/scraper
RUN pnpm run build

# Build backend
WORKDIR /app/apps/backend
RUN pnpm run build

# ============================================
# STAGE 4: Production image
# ============================================
FROM node:20-bookworm-slim AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Install Playwright system dependencies (minimal set for runtime)
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/scraper/package.json ./apps/scraper/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/ ./packages/typescript-config/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Install Playwright browsers
RUN npx playwright install chromium

# Copy built artifacts from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/scraper/dist ./apps/scraper/dist
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

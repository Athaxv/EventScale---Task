FROM node:20-slim

WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages/db (workspace dependency)
COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma/
COPY packages/db/src ./packages/db/src/

# Copy scraper app
COPY apps/scraper/package.json apps/scraper/tsconfig.json ./apps/scraper/
COPY apps/scraper/src ./apps/scraper/src/

# Install dependencies (this will install workspace dependencies)
RUN pnpm install --frozen-lockfile

# Build workspace dependencies first
RUN cd packages/db && pnpm build

# Build scraper
RUN cd apps/scraper && pnpm build

# Install Playwright browsers
RUN cd apps/scraper && pnpm exec playwright install chromium
RUN cd apps/scraper && pnpm exec playwright install-deps chromium

# Set working directory to scraper
WORKDIR /app/apps/scraper

# Start scraper
CMD ["pnpm", "start"]

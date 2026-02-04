FROM node:20-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.6

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy packages/db (workspace dependency)
COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma/
COPY packages/db/src ./packages/db/src/

# Copy backend app
COPY apps/backend/package.json apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src/

# Install dependencies (this will install workspace dependencies)
RUN pnpm install --frozen-lockfile --prod=false

# Build workspace dependencies first
# Generate Prisma client and build db package
RUN cd packages/db && pnpm prisma:generate && pnpm build

# Build backend
RUN cd apps/backend && pnpm build

# Expose port (Render will set PORT env var)
EXPOSE 5000

# Set working directory to backend
WORKDIR /app/apps/backend

# Start backend server
CMD ["node", "dist/index.js"]


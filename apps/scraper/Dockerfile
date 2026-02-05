FROM node:20-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only what we need
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build TS
RUN pnpm build

# Start scraper
CMD ["pnpm", "start"]

#!/bin/bash
set -e

# Force install pnpm 8.15.6
echo "Installing pnpm 8.15.6..."
npm install -g pnpm@8.15.6

# Verify version
echo "pnpm version: $(pnpm --version)"

# Install dependencies
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "Installation complete!"


#!/usr/bin/env bash
# Production build script for IVOLEX MVP
# Generates a production build into the `dist` folder and zips it to ivolex-dist.zip
set -euo pipefail
echo "Installing dependencies..."
npm install --silent
echo "Building production bundle..."
npm run build
echo "Packaging dist into ivolex-dist.zip..."
rm -f ivolex-dist.zip
zip -r ivolex-dist.zip dist
echo "Done. Output: ivolex-dist.zip"

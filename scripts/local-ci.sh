#!/bin/bash

# Local CI Script - Run the same checks as the GitHub Actions pipeline

echo "🚀 Starting Local CI Checks..."

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install Node.js and npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed successfully"

# Run linting
echo "🔍 Running code linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi
echo "✅ Code linting passed"

# Check code formatting
echo "💅 Checking code formatting..."
npx prettier --check .
if [ $? -ne 0 ]; then
    echo "❌ Code formatting check failed"
    exit 1
fi
echo "✅ Code formatting is correct"

# Run security audit
echo "🛡️ Running security audit..."
npm run security:audit
if [ $? -ne 0 ]; then
    echo "❌ Security audit failed"
    exit 1
fi
echo "✅ Security audit passed"

# Run unit tests
echo "🧪 Running unit tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi
echo "✅ Unit tests passed"

# Run API tests
echo "🔌 Running API tests..."
npm run test:api
if [ $? -ne 0 ]; then
    echo "❌ API tests failed"
    exit 1
fi
echo "✅ API tests passed"

# Run Supabase tests
echo "☁️ Running Supabase tests..."
npm run test:supabase
if [ $? -ne 0 ]; then
    echo "❌ Supabase tests failed"
    exit 1
fi
echo "✅ Supabase tests passed"

# Build the frontend
echo "🏗️ Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

echo "🎉 All CI checks passed successfully!"
echo "You're ready to push your changes to GitHub."
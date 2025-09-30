#!/bin/bash

# Production Build Script for IVOLEX
# This script automates the entire production build process

echo "🚀 Starting Production Build Process..."

# Check if we're on Windows or Unix-like system
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows with Git Bash or similar
    IS_WINDOWS=1
else
    IS_WINDOWS=0
fi

# Function to print success messages
print_success() {
    echo "✅ $1"
}

# Function to print error messages
print_error() {
    echo "❌ $1"
}

# Function to print info messages
print_info() {
    echo "ℹ️  $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    print_error "npm is not installed. Please install Node.js and npm."
    exit 1
fi
print_success "Node.js and npm are installed"

# Clean previous builds
print_info "Cleaning previous builds..."
if [ -d "dist" ]; then
    rm -rf dist
    print_success "Cleaned dist directory"
fi

# Install dependencies
print_info "Installing dependencies..."
if [ $IS_WINDOWS -eq 1 ]; then
    npm ci 2>nul
    if [ $? -ne 0 ]; then
        npm install 2>nul
    fi
else
    npm ci || npm install
fi

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

# Run security audit
print_info "Running security audit..."
npm run security:audit
if [ $? -ne 0 ]; then
    print_error "Security audit failed"
    exit 1
fi
print_success "Security audit passed"

# Run linting
print_info "Running code linting..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed"
    exit 1
fi
print_success "Code linting passed"

# Run tests
print_info "Running tests..."
npm test
if [ $? -ne 0 ]; then
    print_error "Tests failed"
    exit 1
fi
print_success "All tests passed"

# Build the application
print_info "Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Application built successfully"

# Check if build was successful
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    print_error "Build directory is empty or does not exist"
    exit 1
fi

# Show build statistics
print_info "Build Statistics:"
echo "  - Build directory: dist/"
echo "  - Total files: $(find dist -type f | wc -l)"
echo "  - Total size: $(du -sh dist | cut -f1)"

# List main build artifacts
echo "  - Main artifacts:"
ls -lh dist/ | head -10

print_success "Production build completed successfully!"
echo ""
echo "📦 Your production build is ready in the 'dist/' directory."
echo "📋 Next steps:"
echo "   1. Deploy the contents of 'dist/' to your web server"
echo "   2. For Docker deployment, run: docker-compose up --build"
echo "   3. For GitHub Pages, the CI/CD pipeline will automatically deploy"
echo ""
echo "📈 Build Summary:"
echo "   - Security: Passed"
echo "   - Linting: Passed"
echo "   - Tests: $(npm test 2>&1 | grep -c "✓") passed"
echo "   - Build: Success"
echo ""
echo "🚀 Ready for production deployment!"
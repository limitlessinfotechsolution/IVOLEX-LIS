#!/bin/bash

# CI Configuration Validation Script
# This script validates all CI/CD configuration files

echo "🔍 Validating CI/CD Configuration Files..."

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

# Check if yq is installed (for YAML validation)
if ! command -v yq &> /dev/null
then
    print_info "yq is not installed. Installing..."
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows with scoop
        if command -v scoop &> /dev/null; then
            scoop install yq
        else
            print_info "Please install yq manually: https://github.com/mikefarah/yq#install"
        fi
    else
        # Unix-like systems
        if command -v brew &> /dev/null; then
            brew install yq
        elif command -v apt-get &> /dev/null; then
            sudo apt-get install yq
        elif command -v yum &> /dev/null; then
            sudo yum install yq
        else
            print_info "Please install yq manually: https://github.com/mikefarah/yq#install"
        fi
    fi
fi

# Validate all workflow files
print_info "Validating GitHub Actions workflow files..."

WORKFLOW_DIR=".github/workflows"
if [ ! -d "$WORKFLOW_DIR" ]; then
    print_error "Workflow directory not found: $WORKFLOW_DIR"
    exit 1
fi

ERROR_COUNT=0
for workflow in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    if [ -f "$workflow" ]; then
        print_info "Validating $workflow..."
        # Basic YAML syntax check
        if python -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
            print_success "  YAML syntax is valid"
        else
            print_error "  YAML syntax error in $workflow"
            ((ERROR_COUNT++))
        fi
        
        # Check for common GitHub Actions syntax
        if grep -q "name:" "$workflow" && grep -q "on:" "$workflow" && grep -q "jobs:" "$workflow"; then
            print_success "  Required GitHub Actions fields present"
        else
            print_error "  Missing required GitHub Actions fields in $workflow"
            ((ERROR_COUNT++))
        fi
    fi
done

# Validate Dockerfile
print_info "Validating Dockerfile..."
if [ -f "Dockerfile" ]; then
    # Check if Dockerfile has basic structure
    if grep -q "FROM " "Dockerfile" && grep -q "WORKDIR " "Dockerfile"; then
        print_success "Dockerfile structure is valid"
    else
        print_error "Dockerfile missing required instructions"
        ((ERROR_COUNT++))
    fi
else
    print_info "Dockerfile not found - this may be intentional"
fi

# Validate docker-compose.yml
print_info "Validating docker-compose.yml..."
if [ -f "docker-compose.yml" ]; then
    if python -c "import yaml; yaml.safe_load(open('docker-compose.yml'))" 2>/dev/null; then
        print_success "docker-compose.yml syntax is valid"
    else
        print_error "docker-compose.yml syntax error"
        ((ERROR_COUNT++))
    fi
else
    print_info "docker-compose.yml not found - this may be intentional"
fi

# Validate package.json
print_info "Validating package.json..."
if [ -f "package.json" ]; then
    if python -c "import json; json.load(open('package.json'))" 2>/dev/null; then
        print_success "package.json syntax is valid"
    else
        print_error "package.json syntax error"
        ((ERROR_COUNT++))
    fi
else
    print_error "package.json not found"
    ((ERROR_COUNT++))
fi

# Summary
echo ""
if [ $ERROR_COUNT -eq 0 ]; then
    print_success "All CI/CD configuration files are valid!"
    echo "🚀 Ready for deployment"
else
    print_error "$ERROR_COUNT configuration file(s) have issues"
    echo "🔧 Please fix the errors above before deploying"
    exit 1
fi
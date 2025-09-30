# CI Configuration Validation Script (PowerShell Version)
# This script validates all CI/CD configuration files

Write-Host "🔍 Validating CI/CD Configuration Files..." -ForegroundColor Green

# Function to print success messages
function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# Function to print error messages
function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Function to print info messages
function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# Validate all workflow files
Print-Info "Validating GitHub Actions workflow files..."

$WorkflowDir = ".github/workflows"
if (!(Test-Path $WorkflowDir)) {
    Print-Error "Workflow directory not found: $WorkflowDir"
    exit 1
}

$ErrorCount = 0
Get-ChildItem $WorkflowDir -Include "*.yml","*.yaml" | ForEach-Object {
    $WorkflowFile = $_.FullName
    Print-Info "Validating $($_.Name)..."
    
    # Basic YAML syntax check
    try {
        $YamlContent = Get-Content $WorkflowFile -Raw
        $null = ConvertFrom-Yaml $YamlContent -ErrorAction Stop
        Print-Success "  YAML syntax is valid"
    } catch {
        # Try alternative method
        try {
            $null = node -e "const fs = require('fs'); const yaml = require('js-yaml'); yaml.load(fs.readFileSync('$WorkflowFile', 'utf8')); console.log('valid');" 2>$null
            Print-Success "  YAML syntax is valid"
        } catch {
            Print-Error "  YAML syntax error in $($_.Name)"
            $ErrorCount++
        }
    }
    
    # Check for common GitHub Actions syntax
    $Content = Get-Content $WorkflowFile
    if (($Content -match "name:") -and ($Content -match "on:") -and ($Content -match "jobs:")) {
        Print-Success "  Required GitHub Actions fields present"
    } else {
        Print-Error "  Missing required GitHub Actions fields in $($_.Name)"
        $ErrorCount++
    }
}

# Validate Dockerfile
Print-Info "Validating Dockerfile..."
if (Test-Path "Dockerfile") {
    $DockerContent = Get-Content "Dockerfile"
    if (($DockerContent -match "FROM ") -and ($DockerContent -match "WORKDIR ")) {
        Print-Success "Dockerfile structure is valid"
    } else {
        Print-Error "Dockerfile missing required instructions"
        $ErrorCount++
    }
} else {
    Print-Info "Dockerfile not found - this may be intentional"
}

# Validate docker-compose.yml
Print-Info "Validating docker-compose.yml..."
if (Test-Path "docker-compose.yml") {
    try {
        $null = node -e "const fs = require('fs'); const yaml = require('js-yaml'); yaml.load(fs.readFileSync('docker-compose.yml', 'utf8')); console.log('valid');" 2>$null
        Print-Success "docker-compose.yml syntax is valid"
    } catch {
        Print-Error "docker-compose.yml syntax error"
        $ErrorCount++
    }
} else {
    Print-Info "docker-compose.yml not found - this may be intentional"
}

# Validate package.json
Print-Info "Validating package.json..."
if (Test-Path "package.json") {
    try {
        $null = Get-Content "package.json" -Raw | ConvertFrom-Json
        Print-Success "package.json syntax is valid"
    } catch {
        Print-Error "package.json syntax error"
        $ErrorCount++
    }
} else {
    Print-Error "package.json not found"
    $ErrorCount++
}

# Summary
Write-Host ""
if ($ErrorCount -eq 0) {
    Print-Success "All CI/CD configuration files are valid!"
    Write-Host "🚀 Ready for deployment" -ForegroundColor Yellow
} else {
    Print-Error "$ErrorCount configuration file(s) have issues"
    Write-Host "🔧 Please fix the errors above before deploying" -ForegroundColor Yellow
    exit 1
}
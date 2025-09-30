# Production Build Script for IVOLEX (PowerShell Version)
# This script automates the entire production build process on Windows

Write-Host "🚀 Starting Production Build Process..." -ForegroundColor Green

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

# Check if npm is installed
try {
    $npmVersion = npm --version
    Print-Success "Node.js and npm are installed (npm v$npmVersion)"
} catch {
    Print-Error "npm is not installed. Please install Node.js and npm."
    exit 1
}

# Clean previous builds
Print-Info "Cleaning previous builds..."
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Print-Success "Cleaned dist directory"
}

# Install dependencies
Print-Info "Installing dependencies..."
npm ci 2>$null
if ($LASTEXITCODE -ne 0) {
    npm install 2>$null
}

if ($LASTEXITCODE -ne 0) {
    Print-Error "Failed to install dependencies"
    exit 1
}
Print-Success "Dependencies installed successfully"

# Run security audit
Print-Info "Running security audit..."
npm run security:audit
if ($LASTEXITCODE -ne 0) {
    Print-Error "Security audit failed"
    exit 1
}
Print-Success "Security audit passed"

# Run linting
Print-Info "Running code linting..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Print-Error "Linting failed"
    exit 1
}
Print-Success "Code linting passed"

# Run tests
Print-Info "Running tests..."
npm test
if ($LASTEXITCODE -ne 0) {
    Print-Error "Tests failed"
    exit 1
}
Print-Success "All tests passed"

# Build the application
Print-Info "Building application for production..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Print-Error "Build failed"
    exit 1
}
Print-Success "Application built successfully"

# Check if build was successful
if (!(Test-Path "dist") -or (Get-ChildItem "dist" -Force | Measure-Object).Count -eq 0) {
    Print-Error "Build directory is empty or does not exist"
    exit 1
}

# Show build statistics
Print-Info "Build Statistics:"
$distPath = Resolve-Path "dist"
$filesCount = (Get-ChildItem -Recurse "dist" -File | Measure-Object).Count
$totalSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum
$sizeInMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "  - Build directory: $distPath"
Write-Host "  - Total files: $filesCount"
Write-Host "  - Total size: $sizeInMB MB"

# List main build artifacts
Write-Host "  - Main artifacts:"
Get-ChildItem "dist" | Select-Object Name, Length | Format-Table -AutoSize

Print-Success "Production build completed successfully!"
Write-Host ""
Write-Host "📦 Your production build is ready in the 'dist/' directory." -ForegroundColor Yellow
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Deploy the contents of 'dist/' to your web server" -ForegroundColor Yellow
Write-Host "   2. For Docker deployment, run: docker-compose up --build" -ForegroundColor Yellow
Write-Host "   3. For GitHub Pages, the CI/CD pipeline will automatically deploy" -ForegroundColor Yellow
Write-Host ""
Write-Host "📈 Build Summary:" -ForegroundColor Yellow
Write-Host "   - Security: Passed" -ForegroundColor Yellow
Write-Host "   - Linting: Passed" -ForegroundColor Yellow
Write-Host "   - Tests: Passed" -ForegroundColor Yellow
Write-Host "   - Build: Success" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Ready for production deployment!" -ForegroundColor Green
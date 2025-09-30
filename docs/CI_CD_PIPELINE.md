# CI/CD Pipeline Documentation

## Overview

This document describes the automated CI/CD pipeline for the IVOLEX e-commerce application. The pipeline automates building, testing, and deploying both the frontend and backend components of the application.

## Pipeline Stages

### 1. Code Quality Checks
- Runs on Ubuntu with Node.js versions 18.x and 20.x
- Installs dependencies using `npm ci` for consistent builds
- Executes ESLint and Stylelint for code quality
- Runs Prettier to check code formatting
- Performs security audit using `better-npm-audit`

### 2. Testing
- Executes unit tests using Vitest
- Runs API-specific tests
- Runs Supabase integration tests
- Uploads coverage reports to Codecov

### 3. Build Frontend
- Builds the React frontend using Vite
- Archives build artifacts for later deployment stages

### 4. Docker Image Build
- Creates a multi-stage Docker image
- Pushes to DockerHub only on main branch commits

### 5. Deployment
- **Staging**: Deploys to staging environment on develop branch commits
- **Production**: Deploys to GitHub Pages and Vercel on main branch commits

### 6. Release
- Automatically creates GitHub releases on successful main branch deployments

## Branch Strategy

- `main`: Production branch - deploys to production environments
- `develop`: Development branch - deploys to staging environment
- Feature branches: Run tests and code quality checks only

## Environment Variables

The pipeline requires the following secrets to be configured in GitHub:

| Secret Name | Purpose |
|-------------|---------|
| `VERCEL_TOKEN` | Authentication for Vercel deployment |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `DOCKER_USERNAME` | DockerHub username |
| `DOCKER_PASSWORD` | DockerHub password |

## Manual Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t ivolex/ivolex-app .

# Run the container
docker run -p 3001:3001 ivolex/ivolex-app
```

### Docker Compose
```bash
# Start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build
```

## CI/CD Validation

To ensure your CI/CD configuration is valid before pushing changes, run the validation scripts:

### Using Bash Script (Linux/macOS/Windows with Git Bash)
```bash
chmod +x scripts/validate-ci.sh
./scripts/validate-ci.sh
```

### Using PowerShell Script (Windows)
```powershell
.\scripts\validate-ci.ps1
```

These scripts will validate:
- YAML syntax of all GitHub Actions workflow files
- Dockerfile structure
- docker-compose.yml syntax
- package.json syntax

## Monitoring

The pipeline includes health checks and monitoring:
- Docker health checks for the API
- Test coverage reporting
- Security scanning
- Performance monitoring through build times

## Troubleshooting

### Common Issues
1. **Build failures**: Check for linting errors or failing tests
2. **Deployment failures**: Verify environment variables are correctly set
3. **Docker issues**: Ensure DockerHub credentials are correct
4. **YAML syntax errors**: Use the validation scripts to check configuration files

### Manual Trigger
The pipeline can be manually triggered through the GitHub Actions interface for on-demand deployments.

## Future Enhancements

Planned improvements to the CI/CD pipeline:
- Integration with performance monitoring tools
- Automated rollback on failed deployments
- Blue-green deployment strategy
- Integration testing in staging environment
# Production Build Guide

## Overview

This guide explains how to create a production-ready build of the IVOLEX e-commerce application and deploy it to various platforms.

## Prerequisites

Before building for production, ensure you have:

1. Node.js (version 18 or higher)
2. npm (comes with Node.js)
3. Git (for version control)
4. Docker (optional, for containerized deployment)

## Automated Production Build

### Using Bash Script (Linux/macOS/Windows with Git Bash)

```bash
chmod +x build-prod.sh
./build-prod.sh
```

### Using PowerShell Script (Windows)

```powershell
.\build-prod.ps1
```

Both scripts will automatically:
1. Clean previous builds
2. Install dependencies
3. Run security audits
4. Run code linting
5. Execute all tests
6. Build the production application
7. Provide a summary of the build

## Manual Production Build

If you prefer to run the steps manually:

```bash
# Clean previous builds
rm -rf dist

# Install dependencies
npm ci

# Run security audit
npm run security:audit

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

## Deployment Options

### 1. Static Hosting (GitHub Pages, Netlify, Vercel)

After building, simply deploy the contents of the `dist/` directory to your static hosting provider.

For GitHub Pages, the CI/CD pipeline automatically deploys the main branch to GitHub Pages.

### 2. Docker Deployment

Build and run with Docker:

```bash
docker-compose up --build
```

Or build the Docker image manually:

```bash
docker build -t ivolex-app .
docker run -p 3001:3001 ivolex-app
```

### 3. Traditional Web Server

1. Copy the contents of the `dist/` directory to your web server
2. Configure your web server to serve `index.html` for all routes (SPA routing)
3. Example Nginx configuration is provided in `nginx.conf`

## Environment Variables

For production deployment, make sure to set the following environment variables:

```bash
# Application settings
VITE_APP_NAME=IVolex
VITE_APP_VERSION=2.0
VITE_API_BASE_URL=https://your-api-domain.com/api

# Supabase configuration (if using real authentication)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Create a `.env.production` file in the root directory with these values.

## Build Artifacts

The production build creates the following in the `dist/` directory:

- `index.html` - Main HTML file
- `assets/` - Directory containing:
  - JavaScript bundles (chunked for performance)
  - CSS files
  - Images and other assets
- Source maps for debugging (in production builds)

## Performance Optimizations

The production build includes several optimizations:

1. **Code Splitting** - JavaScript is split into chunks for faster loading
2. **Minification** - All JavaScript and CSS is minified
3. **Compression** - Assets are compressed for faster downloads
4. **Tree Shaking** - Unused code is removed
5. **Caching** - Long-term caching headers for static assets

## Troubleshooting

### Build Failures

If the build fails:

1. Check for TypeScript/JavaScript errors
2. Ensure all dependencies are installed: `npm install`
3. Check for linting errors: `npm run lint`
4. Run tests to ensure nothing is broken: `npm test`

### Deployment Issues

If the deployed application doesn't work correctly:

1. Verify all environment variables are set correctly
2. Check that routing is configured properly (SPA routing)
3. Ensure the web server is serving `index.html` for all routes
4. Check browser console for errors

## Security Considerations

1. Never commit sensitive environment variables to version control
2. Use HTTPS in production
3. Regularly update dependencies: `npm audit fix`
4. Review the security headers in `nginx.conf`

## Monitoring and Analytics

The application includes built-in analytics that can be enabled with:

```bash
VITE_ENABLE_ANALYTICS=true
```

## Support

For issues with the build process, please check:

1. Node.js version (should be 18+)
2. npm version (should be recent)
3. Available disk space
4. Network connectivity for downloading dependencies
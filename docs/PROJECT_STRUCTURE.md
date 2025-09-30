# Project Structure Documentation

This document outlines the organized directory structure for the IVOLEX project.

## Directory Structure

```
src/
├── app/                    # Main application entry point
│   └── App.jsx            # Main application component
├── main.jsx               # Application entry point
├── assets/                # Static assets
│   └── images/            # Image assets
├── components/            # Reusable UI components
│   ├── common/            # Common UI components (buttons, loaders, etc.)
│   ├── layout/            # Layout components (header, footer, sections)
│   ├── navigation/        # Navigation components
│   ├── product/           # Product-specific components
│   ├── form/              # Form components
│   ├── routes/            # Route components
│   ├── admin/             # Admin-specific components
│   ├── advanced/          # Advanced feature components
│   ├── analytics/         # Analytics components
│   ├── charts/            # Chart components
│   ├── intelligence/       # AI/Intelligence components
│   ├── inventory/          # Inventory components
│   ├── search/            # Search components
│   ├── security/           # Security components
│   ├── settings/           # Settings components
│   ├── shipping/           # Shipping components
│   └── ui/                # Additional UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── pages/                 # Page components and screens
│   ├── index.js           # Pages exports
│   └── screens/           # Individual screen components
├── styles/                # CSS and styling files
├── api/                   # API related code
├── data/                  # Data files and mocks
├── test/                  # Test utilities
├── tests/                 # Test files
├── validation/            # Validation schemas and utilities
├── config/                # Configuration files
└── utils/                 # Utility functions
```

## Component Organization

### Common Components (`src/components/common`)
- Reusable UI elements like buttons, loaders, modals
- Cross-functional components used throughout the application

### Layout Components (`src/components/layout`)
- Header, footer, navigation bars
- Section components for page layouts
- Hero sections, featured products, testimonials

### Navigation Components (`src/components/navigation`)
- Main navigation components
- Breadcrumbs, menus, sidebars

### Product Components (`src/components/product`)
- Product cards, lists, and detail views
- Product-specific UI elements

### Form Components (`src/components/form`)
- Form fields, validation components
- Input components, select dropdowns

### Route Components (`src/components/routes`)
- Components that correspond to specific routes
- Page-level components

## Benefits of This Structure

1. **Clear Separation of Concerns**: Each directory has a specific purpose
2. **Scalability**: Easy to add new components without cluttering directories
3. **Maintainability**: Clear organization makes it easier to find and update components
4. **Consistency**: Standardized structure across the project
5. **Developer Experience**: Intuitive navigation and understanding of the codebase

## Migration Notes

This structure was created by reorganizing the previous mixed structure where components were scattered across `src/ui` and other directories. All components have been moved to their appropriate locations based on their functionality and purpose.
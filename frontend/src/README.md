# Frontend Folder Structure

This document describes the organization of the frontend React application.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Button, Input, etc.)
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components (Header, Footer, etc.)
├── pages/               # Page components
│   ├── auth/            # Authentication pages (Login, Register)
│   ├── dashboard/       # Dashboard pages
│   └── profile/         # Profile pages
├── hooks/               # Custom React hooks
├── services/            # API and external service integrations
│   ├── api/             # API service functions
│   └── auth/            # Authentication services
├── utils/               # Utility functions and helpers
├── assets/              # Static assets
│   ├── images/          # Image files
│   └── icons/           # Icon files
├── styles/              # CSS and styling files
└── index.js             # Main entry point
```

## Component Organization

### Components
- **common/**: Reusable components used across multiple pages
- **forms/**: Form-specific components and form handling
- **layout/**: Components that define the overall page structure

### Pages
- **auth/**: Authentication-related pages (login, register, forgot password)
- **dashboard/**: Main application dashboard and related pages
- **profile/**: User profile and settings pages

### Services
- **api/**: HTTP client and API integration functions
- **auth/**: Authentication and authorization services

### Hooks
- Custom React hooks for shared logic (useAuth, useApi, etc.)

### Utils
- Helper functions, validation utilities, and common utilities

### Assets
- Static files like images, icons, and other media

### Styles
- CSS files, styled-components, or other styling solutions

## Best Practices

1. **Component Naming**: Use PascalCase for component files and folders
2. **File Organization**: Keep related files together in appropriate directories
3. **Import Paths**: Use relative imports within the src directory
4. **Index Files**: Use index.js files for cleaner imports
5. **Consistent Structure**: Follow the established pattern for new components and pages

## Adding New Components

When adding new components:
1. Place them in the appropriate subdirectory under `components/`
2. Create an index.js file if the directory doesn't have one
3. Export the component from the index.js file
4. Update this README if adding new directories or changing structure 
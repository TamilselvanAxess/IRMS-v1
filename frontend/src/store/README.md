# Redux Implementation

This application uses Redux Toolkit for state management. The store is organized into slices for different features.

## Store Structure

```
src/store/
├── index.js              # Main store configuration
├── slices/
│   ├── authSlice.js      # Authentication state management
│   └── themeSlice.js     # Theme state management
└── README.md             # This file
```

## Slices

### Auth Slice (`authSlice.js`)

Manages authentication state including:
- User data
- Authentication status
- Loading states
- Error handling
- Token management

**Actions:**
- `loginUser(credentials)` - Async thunk for user login
- `registerUser(userData)` - Async thunk for user registration
- `checkAuthStatus()` - Async thunk to verify authentication
- `logout()` - Clear authentication state
- `clearError()` - Clear error state
- `setUser(user)` - Set user data

**State:**
```javascript
{
  user: null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

### Theme Slice (`themeSlice.js`)

Manages theme state including:
- Current theme (light/dark)
- Theme persistence in localStorage
- DOM attribute updates

**Actions:**
- `toggleTheme()` - Toggle between light and dark themes
- `setTheme(theme)` - Set specific theme

**Selectors:**
- `selectTheme(state)` - Get current theme
- `selectIsDark(state)` - Check if dark theme is active
- `selectIsLight(state)` - Check if light theme is active

## Usage

### Hooks

Use the custom hooks for typed Redux access:

```javascript
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector((state) => state.theme.theme === 'dark');
  
  // Dispatch actions
  dispatch(loginUser(credentials));
  dispatch(toggleTheme());
};
```

### Authentication Hook

For authentication-specific functionality:

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated, loading, error } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      // Handle successful login
    }
  };
};
```

## API Integration

The auth slice integrates with the API service for:
- Login requests
- Registration requests
- Authentication status verification

All API calls are handled through async thunks with proper error handling and loading states.

## Persistence

- **Authentication**: Token is stored in localStorage
- **Theme**: Theme preference is stored in localStorage
- **State**: Redux state is not persisted by default (can be added with redux-persist if needed)

## Best Practices

1. Use the custom hooks (`useAppDispatch`, `useAppSelector`) instead of plain Redux hooks
2. Use selectors for accessing state
3. Handle loading and error states in components
4. Clear errors when user starts interacting with forms
5. Use async thunks for API calls
6. Keep components focused on presentation, logic in slices 
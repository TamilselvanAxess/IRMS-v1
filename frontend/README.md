# React + Vite + Redux Toolkit

This project provides a complete Redux Toolkit setup with authentication, user management, and UI state management.

## Features

- **Redux Toolkit** - Modern Redux with simplified boilerplate
- **Authentication System** - Complete login/logout flow with token management
- **User Management** - Profile management and preferences
- **UI State Management** - Modals, notifications, themes, forms, pagination
- **API Integration** - Centralized API client with automatic token handling
- **Custom Hooks** - Reusable hooks for auth and UI management
- **Tailwind CSS** - Utility-first CSS framework
- **Component Library** - Reusable components (LoadingSpinner, NotificationSystem)

## Project Structure

```
src/
├── store/                    # Redux store configuration
│   ├── store.js             # Main store setup
│   ├── hooks.js             # Custom Redux hooks
│   ├── index.js             # Store exports
│   └── slices/              # Redux slices
│       ├── authSlice.js     # Authentication state
│       ├── userSlice.js     # User profile & preferences
│       └── uiSlice.js       # UI state (modals, notifications, etc.)
├── components/              # Reusable components
│   ├── LoadingSpinner.jsx   # Loading component
│   └── NotificationSystem.jsx # Notification system
├── hooks/                   # Custom React hooks
│   ├── useAuth.js          # Authentication hook
│   └── useUI.js            # UI management hook
├── utils/                   # Utility functions
│   └── api.js              # API client with auth
└── App.jsx                 # Main application component
```

## Redux Store Structure

### Auth Slice (`authSlice.js`)
- User authentication state
- Login/logout functionality
- Token management
- Authentication status checking

### User Slice (`userSlice.js`)
- User profile data
- User preferences (theme, language, notifications)
- Profile update functionality
- Password change functionality

### UI Slice (`uiSlice.js`)
- Modal states
- Loading states
- Notifications
- Sidebar state
- Theme configuration
- Form states
- Pagination
- Search and filters

## Usage Examples

### Using Authentication

```jsx
import { useAuth } from './hooks/useAuth';

function LoginComponent() {
  const { login, isAuthenticated, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email: 'user@example.com', password: 'password' });
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('Login successful!');
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Using UI Management

```jsx
import { useUI } from './hooks/useUI';

function MyComponent() {
  const { 
    openModal, 
    showSuccessNotification, 
    changeTheme,
    modals,
    theme 
  } = useUI();

  const handleOpenModal = () => {
    openModal('loginModal');
  };

  const handleSuccess = () => {
    showSuccessNotification('Operation completed successfully!');
  };

  const toggleTheme = () => {
    changeTheme(theme.mode === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Using API Client

```jsx
import { authAPI, userAPI } from './utils/api';

// Login
const loginResult = await authAPI.login({ email: 'user@example.com', password: 'password' });

// Get user profile
const profile = await userAPI.getProfile();

// Update profile
const updatedProfile = await userAPI.updateProfile({ firstName: 'John', lastName: 'Doe' });
```

### Using Redux Selectors

```jsx
import { useAppSelector } from './store';

function MyComponent() {
  // Access auth state
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  // Access user state
  const { profile, preferences } = useAppSelector(state => state.user);
  
  // Access UI state
  const { modals, notifications, theme } = useAppSelector(state => state.ui);

  return (
    <div>
      {isAuthenticated ? `Welcome, ${user?.email}` : 'Please log in'}
    </div>
  );
}
```

## Available Actions

### Auth Actions
- `loginUser(credentials)` - Login with email/password
- `logoutUser()` - Logout user
- `checkAuthStatus()` - Check if user is authenticated
- `clearError()` - Clear auth error
- `setToken(token)` - Set authentication token
- `clearToken()` - Clear authentication token

### User Actions
- `fetchUserProfile()` - Fetch user profile
- `updateUserProfile(profileData)` - Update user profile
- `changePassword(passwordData)` - Change user password
- `updatePreferences(preferences)` - Update user preferences
- `setTheme(theme)` - Set user theme preference
- `setLanguage(language)` - Set user language preference
- `toggleNotifications()` - Toggle notification preference

### UI Actions
- `openModal(modalName)` - Open a modal
- `closeModal(modalName)` - Close a modal
- `closeAllModals()` - Close all modals
- `addNotification(notification)` - Add a notification
- `removeNotification(id)` - Remove a notification
- `clearNotifications()` - Clear all notifications
- `toggleSidebar()` - Toggle sidebar
- `setThemeMode(mode)` - Set theme mode
- `updateFormField({ formName, field, value })` - Update form field
- `resetForm(formName)` - Reset form
- `setCurrentPage(page)` - Set current page
- `setSearchQuery(query)` - Set search query
- `setFilters(filters)` - Set filters
- `clearFilters()` - Clear all filters

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Redux DevTools

Install the Redux DevTools browser extension to inspect state and actions in real-time:
- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Check authentication status

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `PUT /api/user/preferences` - Update preferences

## Contributing

1. Follow the existing code structure
2. Use the provided custom hooks for state management
3. Add new slices for domain-specific state
4. Use the API client for all server communication
5. Follow the notification system for user feedback

## License

This project is licensed under the MIT License.

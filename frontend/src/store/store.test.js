import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';

// Test store configuration
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
  });
};

// Test the store configuration
describe('Redux Store', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  test('should have initial auth state', () => {
    const state = store.getState();
    expect(state.auth).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  test('should have initial theme state', () => {
    const state = store.getState();
    expect(state.theme).toHaveProperty('theme');
    expect(['light', 'dark']).toContain(state.theme.theme);
  });

  test('should handle logout action', () => {
    // Set up initial state with user logged in
    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: {
        user: { email: 'test@example.com', name: 'Test User' },
        token: 'test-token',
      },
    });

    // Verify user is logged in
    let state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.user).toBeTruthy();

    // Dispatch logout
    store.dispatch({ type: 'auth/logout' });

    // Verify user is logged out
    state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBeNull();
    expect(state.auth.token).toBeNull();
  });

  test('should handle theme toggle', () => {
    const initialState = store.getState().theme.theme;
    
    // Toggle theme
    store.dispatch({ type: 'theme/toggleTheme' });
    
    const newState = store.getState().theme.theme;
    expect(newState).not.toBe(initialState);
    expect(['light', 'dark']).toContain(newState);
  });
});

export { createTestStore }; 
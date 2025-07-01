import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // Check localStorage for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getInitialBranding = () => {
  const savedBranding = localStorage.getItem('branding');
  return savedBranding || 'primary';
};

const initialState = {
  theme: getInitialTheme(),
  branding: getInitialBranding(), // 'primary', 'secondary', 'tertiary', 'custom'
  colorScheme: 'blue', // 'blue', 'purple', 'green', 'orange', 'red', 'teal'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      // Update data attributes on document
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.setAttribute('data-branding', state.branding);
      document.documentElement.setAttribute('data-color-scheme', state.colorScheme);
      document.body.className = `theme-${newTheme} branding-${state.branding} scheme-${state.colorScheme}`;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      
      // Update data attributes on document
      document.documentElement.setAttribute('data-theme', action.payload);
      document.documentElement.setAttribute('data-branding', state.branding);
      document.documentElement.setAttribute('data-color-scheme', state.colorScheme);
      document.body.className = `theme-${action.payload} branding-${state.branding} scheme-${state.colorScheme}`;
    },
    setBranding: (state, action) => {
      state.branding = action.payload;
      localStorage.setItem('branding', action.payload);
      
      // Update data attributes on document
      document.documentElement.setAttribute('data-theme', state.theme);
      document.documentElement.setAttribute('data-branding', action.payload);
      document.documentElement.setAttribute('data-color-scheme', state.colorScheme);
      document.body.className = `theme-${state.theme} branding-${action.payload} scheme-${state.colorScheme}`;
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload;
      localStorage.setItem('colorScheme', action.payload);
      
      // Update data attributes on document
      document.documentElement.setAttribute('data-theme', state.theme);
      document.documentElement.setAttribute('data-branding', state.branding);
      document.documentElement.setAttribute('data-color-scheme', action.payload);
      document.body.className = `theme-${state.theme} branding-${state.branding} scheme-${action.payload}`;
    },
    setThemeConfig: (state, action) => {
      const { theme, branding, colorScheme } = action.payload;
      state.theme = theme || state.theme;
      state.branding = branding || state.branding;
      state.colorScheme = colorScheme || state.colorScheme;
      
      localStorage.setItem('theme', state.theme);
      localStorage.setItem('branding', state.branding);
      localStorage.setItem('colorScheme', state.colorScheme);
      
      // Update data attributes on document
      document.documentElement.setAttribute('data-theme', state.theme);
      document.documentElement.setAttribute('data-branding', state.branding);
      document.documentElement.setAttribute('data-color-scheme', state.colorScheme);
      document.body.className = `theme-${state.theme} branding-${state.branding} scheme-${state.colorScheme}`;
    },
  },
});

export const { toggleTheme, setTheme, setBranding, setColorScheme, setThemeConfig } = themeSlice.actions;

// Selectors
export const selectTheme = (state) => state.theme.theme;
export const selectBranding = (state) => state.theme.branding;
export const selectColorScheme = (state) => state.theme.colorScheme;
export const selectIsDark = (state) => state.theme.theme === 'dark';
export const selectIsLight = (state) => state.theme.theme === 'light';
export const selectThemeConfig = (state) => ({
  theme: state.theme.theme,
  branding: state.theme.branding,
  colorScheme: state.theme.colorScheme,
});

export default themeSlice.reducer; 
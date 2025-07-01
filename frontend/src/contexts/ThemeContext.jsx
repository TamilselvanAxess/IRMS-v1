import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  setTheme, 
  setBranding, 
  setColorScheme, 
  setThemeConfig,
  selectThemeConfig 
} from '../store/slices/themeSlice';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Available branding options
export const BRANDING_OPTIONS = {
  primary: {
    name: 'Primary',
    description: 'Main brand identity with bold colors',
    style: 'bold'
  },
  secondary: {
    name: 'Secondary', 
    description: 'Alternative brand with softer tones',
    style: 'soft'
  },
  tertiary: {
    name: 'Tertiary',
    description: 'Minimalist approach with subtle branding',
    style: 'minimal'
  },
  custom: {
    name: 'Custom',
    description: 'User-defined branding preferences',
    style: 'custom'
  }
};

// Available color schemes
export const COLOR_SCHEMES = {
  blue: {
    name: 'Ocean Blue',
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#1d4ed8'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#6d28d9'
  },
  green: {
    name: 'Emerald Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#047857'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#ea580c',
    secondary: '#f97316',
    accent: '#c2410c'
  },
  red: {
    name: 'Crimson Red',
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#b91c1c'
  },
  teal: {
    name: 'Ocean Teal',
    primary: '#0d9488',
    secondary: '#14b8a6',
    accent: '#0f766e'
  }
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const themeConfig = useAppSelector(selectThemeConfig);
  
  const [localTheme, setLocalTheme] = useState(themeConfig.theme);
  const [localBranding, setLocalBranding] = useState(themeConfig.branding);
  const [localColorScheme, setLocalColorScheme] = useState(themeConfig.colorScheme);

  // Sync with Redux store
  useEffect(() => {
    setLocalTheme(themeConfig.theme);
    setLocalBranding(themeConfig.branding);
    setLocalColorScheme(themeConfig.colorScheme);
  }, [themeConfig]);

  const toggleTheme = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    dispatch(setTheme(newTheme));
  };

  const changeTheme = (theme) => {
    setLocalTheme(theme);
    dispatch(setTheme(theme));
  };

  const changeBranding = (branding) => {
    setLocalBranding(branding);
    dispatch(setBranding(branding));
  };

  const changeColorScheme = (colorScheme) => {
    setLocalColorScheme(colorScheme);
    dispatch(setColorScheme(colorScheme));
  };

  const updateThemeConfig = (config) => {
    const { theme, branding, colorScheme } = config;
    if (theme) setLocalTheme(theme);
    if (branding) setLocalBranding(branding);
    if (colorScheme) setLocalColorScheme(colorScheme);
    dispatch(setThemeConfig(config));
  };

  // Get current branding info
  const getCurrentBranding = () => BRANDING_OPTIONS[localBranding] || BRANDING_OPTIONS.primary;
  
  // Get current color scheme info
  const getCurrentColorScheme = () => COLOR_SCHEMES[localColorScheme] || COLOR_SCHEMES.blue;

  // Get computed theme values
  const getThemeValues = () => {
    const colorScheme = getCurrentColorScheme();
    const branding = getCurrentBranding();
    
    return {
      primary: colorScheme.primary,
      secondary: colorScheme.secondary,
      accent: colorScheme.accent,
      branding: branding,
      isDark: localTheme === 'dark',
      isLight: localTheme === 'light',
      isPrimary: localBranding === 'primary',
      isSecondary: localBranding === 'secondary',
      isTertiary: localBranding === 'tertiary',
      isCustom: localBranding === 'custom'
    };
  };

  const value = {
    // Current state
    theme: localTheme,
    branding: localBranding,
    colorScheme: localColorScheme,
    
    // Computed values
    isDark: localTheme === 'dark',
    isLight: localTheme === 'light',
    isPrimary: localBranding === 'primary',
    isSecondary: localBranding === 'secondary',
    isTertiary: localBranding === 'tertiary',
    isCustom: localBranding === 'custom',
    
    // Theme values
    themeValues: getThemeValues(),
    
    // Actions
    toggleTheme,
    changeTheme,
    changeBranding,
    changeColorScheme,
    updateThemeConfig,
    
    // Available options
    brandingOptions: BRANDING_OPTIONS,
    colorSchemes: COLOR_SCHEMES,
    getCurrentBranding,
    getCurrentColorScheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
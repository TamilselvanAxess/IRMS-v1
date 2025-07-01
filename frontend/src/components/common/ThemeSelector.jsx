import React, { useState } from 'react';
import { useTheme, BRANDING_OPTIONS, COLOR_SCHEMES } from '../../contexts/ThemeContext';
import { Card, Button, Select } from './index';
import { Palette, Sun, Moon, Settings, Sparkles, Zap, Shield, Star } from 'lucide-react';

const ThemeSelector = ({ className = '' }) => {
  const {
    theme,
    branding,
    colorScheme,
    isDark,
    isLight,
    isPrimary,
    isSecondary,
    isTertiary,
    isCustom,
    changeTheme,
    changeBranding,
    changeColorScheme,
    themeValues,
    brandingOptions,
    colorSchemes
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const brandingIcons = {
    primary: <Star className="w-4 h-4" />,
    secondary: <Sparkles className="w-4 h-4" />,
    tertiary: <Shield className="w-4 h-4" />,
    custom: <Zap className="w-4 h-4" />
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleBrandingChange = (newBranding) => {
    changeBranding(newBranding);
  };

  const handleColorSchemeChange = (newColorScheme) => {
    changeColorScheme(newColorScheme);
  };

  return (
    <div className={`theme-selector ${className}`}>
      {/* Quick Theme Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Sun className={`w-5 h-5 ${isLight ? 'text-yellow-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${isLight ? 'text-gray-900' : 'text-gray-400'}`}>Light</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
          className="relative"
        >
          <div className="flex items-center space-x-2">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{isDark ? 'Dark' : 'Light'}</span>
          </div>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Moon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-100' : 'text-gray-400'}`}>Dark</span>
        </div>
      </div>

      {/* Advanced Theme Controls */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Theme Configuration</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            icon={<Settings className="w-4 h-4" />}
          >
            {isOpen ? 'Hide' : 'Advanced'}
          </Button>
        </div>

        {/* Current Theme Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{theme}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Branding</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{branding}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Colors</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{colorScheme}</div>
          </div>
        </div>

        {/* Advanced Controls */}
        {isOpen && (
          <div className="space-y-6">
            {/* Branding Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Branding Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(brandingOptions).map(([key, option]) => (
                  <Button
                    key={key}
                    variant={branding === key ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleBrandingChange(key)}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    {brandingIcons[key]}
                    <span className="text-xs">{option.name}</span>
                    <span className="text-xs opacity-75">{option.style}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Scheme Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Color Scheme</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <Button
                    key={key}
                    variant={colorScheme === key ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleColorSchemeChange(key)}
                    className="flex items-center space-x-2 h-auto py-3"
                    style={{
                      '--tw-gradient-from': scheme.primary,
                      '--tw-gradient-to': scheme.secondary,
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <span className="text-sm">{scheme.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Theme Mode Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Theme Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isLight ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className="flex items-center space-x-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </Button>
                <Button
                  variant={isDark ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className="flex items-center space-x-2"
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </Button>
              </div>
            </div>

            {/* Current Theme Values Display */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="text-sm font-medium mb-2">Current Theme Values</h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium">Primary:</span>
                  <div 
                    className="w-4 h-4 rounded mt-1"
                    style={{ backgroundColor: themeValues.primary }}
                  />
                  <span className="ml-1">{themeValues.primary}</span>
                </div>
                <div>
                  <span className="font-medium">Secondary:</span>
                  <div 
                    className="w-4 h-4 rounded mt-1"
                    style={{ backgroundColor: themeValues.secondary }}
                  />
                  <span className="ml-1">{themeValues.secondary}</span>
                </div>
                <div>
                  <span className="font-medium">Accent:</span>
                  <div 
                    className="w-4 h-4 rounded mt-1"
                    style={{ backgroundColor: themeValues.accent }}
                  />
                  <span className="ml-1">{themeValues.accent}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ThemeSelector; 
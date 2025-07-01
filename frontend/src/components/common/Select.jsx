import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, Search, X } from 'lucide-react';

const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  variant = 'default',
  size = 'md',
  placeholder = 'Select an option...',
  searchable = false,
  clearable = false,
  multiple = false,
  maxItems = 5,
  onSearch,
  renderOption,
  allowEmpty = false,
  disabled = false,
  loading = false,
  ...props 
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : null);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variantClasses = {
    default: `
      ${isDark 
        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/80' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
      }
    `,
    glass: `
      ${isDark 
        ? 'bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15' 
        : 'bg-white/80 backdrop-blur-lg border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white/90'
      }
    `,
    minimal: `
      ${isDark 
        ? 'bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
        : 'bg-transparent border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
      }
    `
  };

  const selectClasses = `
    w-full border-2 rounded-xl font-medium appearance-none
    transition-none cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error 
      ? isDark 
        ? 'border-red-400 focus:ring-red-500' 
        : 'border-red-500 focus:ring-red-500'
      : isDark 
        ? 'focus:ring-blue-500/50' 
        : 'focus:ring-blue-500/25'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${loading ? 'opacity-75 cursor-wait' : ''}
    pl-4 pr-10 py-4
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const dropdownClasses = `
    absolute top-full left-0 right-0 mt-1 z-50
    ${isDark 
      ? 'bg-gray-800 border border-gray-700 shadow-2xl' 
      : 'bg-white border border-gray-200 shadow-xl'
    }
    rounded-xl max-h-60 overflow-hidden
  `;

  const handleOptionClick = (option) => {
    if (multiple) {
      const isSelected = selectedOptions.some(selected => selected.value === option.value);
      const newSelection = isSelected
        ? selectedOptions.filter(selected => selected.value !== option.value)
        : [...selectedOptions, option];
      
      setSelectedOptions(newSelection);
      props.onChange?.({ target: { value: newSelection.map(opt => opt.value) } });
    } else {
      setSelectedOptions(option);
      props.onChange?.({ target: { value: option.value } });
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      setSelectedOptions([]);
      props.onChange?.({ target: { value: [] } });
    } else {
      setSelectedOptions(null);
      props.onChange?.({ target: { value: '' } });
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} items selected`;
    }
    return selectedOptions?.label || placeholder;
  };

  const renderOptionContent = (option) => {
    if (renderOption) {
      return renderOption(option);
    }
    return option.label;
  };

  return (
    <div className={`w-full relative ${className}`} ref={selectRef}>
      {label && (
        <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <div
          className={selectClasses}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
        >
          <span className={`block truncate ${!selectedOptions ? 'text-gray-500' : ''}`}>
            {getDisplayValue()}
          </span>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {clearable && selectedOptions && (
              <button
                onClick={handleClear}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isDark 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
            )}
          </div>
        </div>

        {isOpen && (
          <div className={dropdownClasses}>
            {searchable && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      onSearch?.(e.target.value);
                    }}
                    className={`w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg cursor-text ${
                      isDark 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className={`p-4 text-center text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.slice(0, maxItems).map((option) => {
                  const isSelected = multiple
                    ? selectedOptions.some(selected => selected.value === option.value)
                    : selectedOptions?.value === option.value;

                  return (
                    <div
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? isDark 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white'
                          : isDark 
                            ? 'hover:bg-gray-700 text-gray-200' 
                            : 'hover:bg-gray-100 text-gray-900'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {renderOptionContent(option)}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center space-x-1">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Select; 
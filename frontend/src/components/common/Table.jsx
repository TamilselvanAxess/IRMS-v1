import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Table = ({ 
  data = [], 
  columns = [], 
  className = '',
  variant = 'default',
  size = 'md',
  sortable = true,
  selectable = false,
  searchable = false,
  pagination = false,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onSelectionChange,
  onSort,
  ...props 
}) => {
  const { isDark } = useTheme();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Base classes
  const baseClasses = `
    w-full border-collapse transition-all duration-300 ease-out
  `;

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: `
      ${isDark 
        ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700/50' 
        : 'bg-white border border-gray-200'
      }
    `,
    glass: `
      ${isDark 
        ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50'
      }
    `,
    minimal: `
      ${isDark 
        ? 'bg-transparent border border-gray-700/30' 
        : 'bg-transparent border border-gray-200'
      }
    `
  };

  const tableClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = data;

    // Apply search filter
    if (searchTerm && searchable) {
      filteredData = data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key && sortable) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, searchable, sortable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination ? processedData.slice(startIndex, endIndex) : processedData;

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;
    
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.({ key, direction });
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = paginatedData.map(row => row.id || row._id);
      setSelectedRows(new Set(allIds));
      onSelectionChange?.(allIds);
    }
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!sortable || !columns.find(col => col.key === columnKey)?.sortable !== false) {
      return null;
    }

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4 ml-1" /> : 
        <ChevronDown className="w-4 h-4 ml-1" />;
    }
    return <ChevronUp className="w-4 h-4 ml-1 opacity-30" />;
  };

  // Render cell content
  const renderCell = (row, column) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.format) {
      return column.format(value);
    }
    
    return value;
  };

  return (
    <div className={`w-full ${variantClasses[variant]} rounded-2xl overflow-hidden`}>
      {/* Search and Controls */}
      {(searchable || selectable) && (
        <div className={`p-4 ${isDark ? 'border-b border-gray-700/50' : 'border-b border-gray-200'}`}>
          <div className="flex items-center justify-between gap-4">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border cursor-text ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            )}
            {selectable && selectedRows.size > 0 && (
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={tableClasses} {...props}>
          <thead>
            <tr className={`${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className={`w-4 h-4 rounded border-2 ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-blue-400' 
                        : 'bg-white border-gray-300 text-blue-600'
                    } focus:ring-blue-500`}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 text-left font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  } ${column.sortable !== false && sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/30' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="p-8 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="p-8 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-3`}>
                      <Filter className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || row._id || index}
                  className={`
                    transition-colors duration-200
                    ${isDark ? 'border-b border-gray-700/30' : 'border-b border-gray-200'}
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/20' : ''}
                    ${selectedRows.has(row.id || row._id) ? (isDark ? 'bg-blue-900/20' : 'bg-blue-50') : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="w-12 p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id || row._id)}
                        onChange={() => handleRowSelect(row.id || row._id)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-4 h-4 rounded border-2 ${
                          isDark 
                            ? 'bg-gray-600 border-gray-500 text-blue-400' 
                            : 'bg-white border-gray-300 text-blue-600'
                        } focus:ring-blue-500`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className={`p-4 flex items-center justify-between ${isDark ? 'border-t border-gray-700/50' : 'border-t border-gray-200'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {startIndex + 1} to {Math.min(endIndex, processedData.length)} of {processedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === 1
                  ? `${isDark ? 'text-gray-600' : 'text-gray-400'} cursor-not-allowed`
                  : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? `${isDark ? 'text-gray-600' : 'text-gray-400'} cursor-not-allowed`
                  : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Table sub-components for better structure
Table.Header = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`mb-4 ${isDark ? 'text-white' : 'text-gray-900'} ${className}`} {...props}>
      {children}
    </div>
  );
};

Table.Title = ({ children, className = '', size = 'lg', ...props }) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  const titleClasses = `
    ${sizeClasses[size]}
    ${isDark ? 'text-white' : 'text-gray-900'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <h3 className={titleClasses} {...props}>
      {children}
    </h3>
  );
};

Table.Subtitle = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${className}`} {...props}>
      {children}
    </p>
  );
};

Table.Actions = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Table; 
import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { Card, Table, Spinner } from '../../components/common';
import {
  Users,
  UserCheck,
  Code,
  Bug,
  BookOpen,
  Calendar,
  BadgeCheck,
  Book,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  User,
  Layers,
  ClipboardCheck,
  HandCoins,
  RefreshCw,
  Eye,
  Pencil,
  Clock,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { fetchCandidates, selectCandidates, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';
import { useNavigate } from 'react-router-dom';
import DetailUserForm from './DetailUserForm';
import FinanceUserForm from './FinanceUserForm';
import { selectParticipants, fetchParticipants as fetchParticipantsList } from '../../store/slices/participantsSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const candidates = useAppSelector(selectCandidates);
  const candidatesLoading = useAppSelector(selectCandidatesLoading);
  const candidatesError = useAppSelector(selectCandidatesError);
  const navigate = useNavigate();
  const participants = useAppSelector(selectParticipants);
  const participantsLoading = useAppSelector((state) => state.participants.loading);

  // Fetch candidates on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCandidates());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch participants if not loaded
  useEffect(() => {
    if (isAuthenticated && (!participants || participants.length === 0)) {
      dispatch(fetchParticipantsList());
    }
  }, [dispatch, isAuthenticated, participants]);

  // Filter state (must be before any return)
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterOnBoarded, setFilterOnBoarded] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Map candidate data to table row format
  const tableData = useMemo(() => {
    // DEBUG: Log candidates and participants for agent mapping
    if (candidates && participants) {
      console.log('Sample candidates:', candidates.slice(0, 5));
      console.log('All participants:', participants);
    }
    // Create a map for quick lookup of agent name by name (or empId if you want to match by that)
    const agentMap = (participants || []).reduce((acc, p) => {
      if ((p.role || '').toLowerCase() === 'agent') {
        acc[p.name] = p;
      }
      return acc;
    }, {});
    return (candidates || []).map((c) => {
      const stage = c.training?.stage || '';
      // Try to get the agent participant object for more info
      const agentObj = c.agentName ? agentMap[c.agentName] : null;
      const agentDisplay = agentObj ? `${agentObj.name} (${agentObj.empId})` : (c.agentName || '-');
      return {
        studentId: c.candidateId || c._id || '',
        name: c.fullName || c.name || '',
        category: c.category || '',
        course: c.course || c.othersCourseName || '',
        status: c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : '',
        stage: stage || agentDisplay || '-',
        loan: (Array.isArray(c.loans) && c.loans.length > 0 && typeof c.loans[0].loan === 'boolean')
          ? (c.loans[0].loan ? 'Yes' : 'No')
          : 'No',
        onBoarded: (Array.isArray(c.offers) && c.offers.length > 0 && c.offers[0].onboarded) || false,
      };
    });
  }, [candidates, participants]);

  // Unique options for filters
  const courseOptions = Array.from(new Set(tableData.map(row => row.course).filter(Boolean)));
  const categoryOptions = Array.from(new Set(tableData.map(row => row.category).filter(Boolean)));
  const statusOptions = Array.from(new Set(tableData.map(row => row.status).filter(Boolean)));
  const stageOptions = Array.from(new Set(tableData.map(row => row.stage).filter(Boolean)));

  // Filtered data
  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      // Search filter - check all fields
      if (searchKeyword) {
        const searchStr = searchKeyword.toLowerCase();
        const rowValues = [
          row.studentId,
          row.name,
          row.category,
          row.course,
          row.status,
          row.stage,
          row.loan
        ].map(val => String(val).toLowerCase());
        
        if (!rowValues.some(val => val.includes(searchStr))) {
          return false;
        }
      }

      // Course filter
      if (filterCourse && row.course !== filterCourse) {
        return false;
      }

      // Category filter
      if (filterCategory && row.category !== filterCategory) {
        return false;
      }

      // Status filter
      if (filterStatus && row.status !== filterStatus) {
        return false;
      }

      // Stage filter
      if (filterStage && row.stage !== filterStage) {
        return false;
      }

      // OnBoarded filter
      if (filterOnBoarded !== '') {
        const isOnBoarded = filterOnBoarded === 'true';
        if (row.onBoarded !== isOnBoarded) {
          return false;
        }
      }

      return true;
    });
  }, [tableData, filterCourse, filterCategory, filterStatus, filterStage, filterOnBoarded, searchKeyword]);

  if (!isAuthenticated) {
    return null;
  }

  // Before rendering the table, handle loading and error states
  if (candidatesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <span className="text-lg text-gray-600 dark:text-gray-400">Loading candidates...</span>
        </div>
      </div>
    );
  }

  if (candidatesError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Candidates</h3>
            <p className="text-red-600 dark:text-red-300">{candidatesError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from candidate data
  const totalCandidates = tableData.length;
  const activeCandidates = tableData.filter(row => row.status.toLowerCase() === 'active').length;
  const softwareDevCount = tableData.filter(row => row.course.toLowerCase().includes('development')).length;
  const softwareTestingCount = tableData.filter(row => row.course.toLowerCase().includes('testing')).length;
  const otherCoursesCount = tableData.filter(row => row.course && !row.course.toLowerCase().includes('development') && !row.course.toLowerCase().includes('testing')).length;

  // Cards use real data now
  const statsCards = [
    {
      title: 'Total Candidates',
      value: totalCandidates.toLocaleString(),
      change: '', // You can add logic for change if you want
      changeType: '',
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Active Candidates',
      value: activeCandidates.toLocaleString(),
      change: '',
      changeType: '',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'Software Development',
      value: softwareDevCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: '💻',
      color: 'purple'
    },
    {
      title: 'Software Testing',
      value: softwareTestingCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: '🐛',
      color: 'orange'
    },
    {
      title: 'Other Courses',
      value: otherCoursesCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: '📚',
      color: 'emerald'
    }
  ];

  const tableColumns = [
    {
      key: 'studentId',
      label: 'Student ID',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '180px',
      render: (value) => (
        <span className="flex items-center gap-2 max-w-full truncate" title={value}>
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{value}</span>
        </span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      width: '150px',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 max-w-full truncate" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      width: '200px',
      render: (value) => (
        <span className="flex items-center gap-2 max-w-full truncate" title={value}>
          <Book className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{value}</span>
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {value === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {value}
        </span>
      )
    },
    {
      key: 'loan',
      label: 'Loan',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Yes' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'onBoarded',
      label: 'On Boarded',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className="text-sm font-semibold">
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: '200px',
      render: (value, row) => {
        const role = (user?.role || '').toLowerCase();
        const id = row.studentId;
        // Timeline and View icons for all users
        const timelineBtn = (
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Timeline"
            aria-label="Timeline"
            onClick={() => navigate(`/dashboard/timeline/${id}`)}
          >
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>
        );
        const viewBtn = (
          <button
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            title="View"
            aria-label="View"
            onClick={() => navigate(`/dashboard/view/${id}`)}
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        );
        if (["admin", "superadmin"].includes(role)) {
          return (
            <div className="flex gap-1 lg:gap-2">
              {timelineBtn}
              {viewBtn}
              {/* Edit icons */}
              <button
                className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                title="Edit Enroll"
                aria-label="Edit Enroll"
                onClick={() => navigate(`/dashboard/edit/${id}`)}
              >
                <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
                title="Edit Detail"
                aria-label="Edit Detail"
                onClick={() => navigate(`/dashboard/edit-detail/${id}`)}
              >
                <Pencil className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                title="Edit Finance"
                aria-label="Edit Finance"
                onClick={() => navigate(`/dashboard/edit-finance/${id}`)}
              >
                <Pencil className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          );
        } else if (role === "enroll") {
          return (
            <div className="flex gap-1 lg:gap-2">
              {timelineBtn}
              {viewBtn}
              <button
                className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                title="Edit Enroll"
                aria-label="Edit Enroll"
                onClick={() => navigate(`/dashboard/edit/${id}`)}
              >
                <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          );
        } else if (role === "detail" || role === "details") {
          return (
            <div className="flex gap-1 lg:gap-2">
              {timelineBtn}
              {viewBtn}
              <button
                className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
                title="Edit Detail"
                aria-label="Edit Detail"
                onClick={() => navigate(`/dashboard/edit-detail/${id}`)}
              >
                <Pencil className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </button>
            </div>
          );
        } else if (role === "finance") {
          return (
            <div className="flex gap-1 lg:gap-2">
              {timelineBtn}
              {viewBtn}
              <button
                className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                title="Edit Finance"
                aria-label="Edit Finance"
                onClick={() => navigate(`/dashboard/edit-finance/${id}`)}
              >
                <Pencil className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex gap-1 lg:gap-2">
              {timelineBtn}
              {viewBtn}
            </div>
          );
        }
      }
    }
  ];

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    // Reset all filters
    setFilterCourse('');
    setFilterCategory('');
    setFilterStatus('');
    setFilterStage('');
    setFilterOnBoarded('');
    setSearchKeyword('');
    // Reset pagination
    setCurrentPage(1);
    // Fetch fresh data
    try {
      await dispatch(fetchCandidates());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.name || user?.email || 'User'}! Here's what's happening today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last updated</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900',
              green: 'bg-green-100 dark:bg-green-900',
              purple: 'bg-purple-100 dark:bg-purple-900',
              orange: 'bg-orange-100 dark:bg-orange-900',
              emerald: 'bg-emerald-100 dark:bg-emerald-900'
            };
            const textColorClasses = {
              blue: 'text-blue-600 dark:text-blue-400',
              green: 'text-green-600 dark:text-green-400',
              purple: 'text-purple-600 dark:text-purple-400',
              orange: 'text-orange-600 dark:text-orange-400',
              emerald: 'text-emerald-600 dark:text-emerald-400'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
                <div className={`mb-2 flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[card.color]}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{card.title}</div>
                <div className={`text-2xl font-bold ${textColorClasses[card.color]}`}>{card.value}</div>
                <div className="text-xs text-gray-400 mt-1">All registered</div>
              </div>
            );
          })}
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden w-full">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Students</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Latest student activity and information</div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="px-4 sm:px-6 pb-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {refreshing ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCourse}
                  onChange={e => setFilterCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courseOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStage}
                  onChange={e => setFilterStage(e.target.value)}
                >
                  <option value="">All Stages</option>
                  {stageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterOnBoarded}
                  onChange={e => setFilterOnBoarded(e.target.value)}
                >
                  <option value="">All On Boarded</option>
                  <option value="true">On Boarded</option>
                  <option value="false">Not On Boarded</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="min-h-[400px] sm:min-h-[500px] pb-4 sm:pb-6 w-full">
            <Table
              data={filteredData}
              columns={tableColumns}
              variant="default"
              pagination={true}
              itemsPerPage={10}
              className="mt-4 w-full"
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
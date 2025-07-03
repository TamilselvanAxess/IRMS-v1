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
  Pencil
} from 'lucide-react';
import { fetchCandidates, selectCandidates, selectCandidatesLoading, selectCandidatesError } from '../../store/slices/candidateSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const candidates = useAppSelector(selectCandidates);
  const candidatesLoading = useAppSelector(selectCandidatesLoading);
  const candidatesError = useAppSelector(selectCandidatesError);

  // Fetch candidates on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCandidates());
    }
  }, [dispatch, isAuthenticated]);

  // Filter state (must be before any return)
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterOnBoarded, setFilterOnBoarded] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Map candidate data to table row format
  const tableData = useMemo(() => {
    return (candidates || []).map((c) => {
      const stage = c.training?.stage || '';
      const agentName = c.agentName || '';
      return {
        studentId: c.candidateId || c._id || '',
        name: c.fullName || c.name || '',
        category: c.category || '',
        course: c.course || c.othersCourseName || '',
        status: c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : '',
        stage: stage || agentName || '-',
        loan: (Array.isArray(c.loans) && c.loans.length > 0 && c.loans[0].loan)
          ? 'Approved'
          : (Array.isArray(c.loans) && c.loans.length > 0 ? 'Pending' : 'Rejected'),
        onBoarded: (Array.isArray(c.offers) && c.offers.length > 0 && c.offers[0].onboarded) || false,
      };
    });
  }, [candidates]);

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
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-8 h-8" />
        <span className="ml-4 text-lg">Loading candidates...</span>
      </div>
    );
  }

  if (candidatesError) {
    return (
      <div className="flex flex-col items-center h-64 justify-center text-red-600 dark:text-red-400">
        <span className="text-lg font-semibold">Error loading candidates:</span>
        <span>{candidatesError}</span>
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
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Candidates',
      value: activeCandidates.toLocaleString(),
      change: '',
      changeType: '',
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Software Development',
      value: softwareDevCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: Code,
      color: 'purple'
    },
    {
      title: 'Software Testing',
      value: softwareTestingCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: Bug,
      color: 'orange'
    },
    {
      title: 'Other Courses',
      value: otherCoursesCount.toLocaleString(),
      change: '',
      changeType: '',
      icon: BookOpen,
      color: 'emerald'
    }
  ];

  const tableColumns = [
    {
      key: 'studentId',
      label: 'Student ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" />{value}</span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{value}</span>
      )
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-2"><Book className="w-4 h-4 text-gray-400" />{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
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
      key: 'stage',
      label: 'Agent',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'loan',
      label: 'Loan',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          <HandCoins className="w-3 h-3" /> {value}
        </span>
      )
    },
    {
      key: 'onBoarded',
      label: 'On Boarded',
      sortable: true,
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
      render: () => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            title="View"
            aria-label="View"
            onClick={() => {/* handle view action */}}
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
            title="Edit"
            aria-label="Edit"
            onClick={() => {/* handle edit action */}}
          >
            <Pencil className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      )
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
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || user?.email || 'User'}! Here's what's happening today.
          </p>
            </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
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
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            purple: 'text-purple-600 dark:text-purple-400',
            orange: 'text-orange-600 dark:text-orange-400',
            emerald: 'text-emerald-600 dark:text-emerald-400'
          };
          return (
            <Card key={index} variant="glass" className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 ${colorClasses[card.color]}`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Students Table */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>Students</Card.Title>
          <Card.Subtitle>Latest student activity and information</Card.Subtitle>
        </Card.Header>
        <Card.Content>
          {/* Table Filters & Refresh */}
          <div className="flex gap-4 items-center mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700" style={{flexWrap: 'nowrap'}}>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minWidth: 200 }}
            />
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={filterCourse}
              onChange={e => setFilterCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courseOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
            >
              <option value="">All Stages</option>
              {stageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={filterOnBoarded}
              onChange={e => setFilterOnBoarded(e.target.value)}
            >
              <option value="">All On Boarded</option>
              <option value="true">On Boarded</option>
              <option value="false">Not On Boarded</option>
            </select>
            <div className="flex-1" />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
              style={{ whiteSpace: 'nowrap' }}
            >
              {refreshing ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>
          <div className="min-h-[500px]">
            <Table
              data={filteredData}
              columns={tableColumns}
              variant="glass"
              pagination={true}
              itemsPerPage={10}
              className="mt-4"
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard; 
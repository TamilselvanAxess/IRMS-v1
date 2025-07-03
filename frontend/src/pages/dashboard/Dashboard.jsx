import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../hooks/redux';
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

const Dashboard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Filter state (must be before any return)
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterOnBoarded, setFilterOnBoarded] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Table data and columns
  const tableData = [
    {
      studentId: 'STU001',
      name: 'John Doe',
      category: 'General',
      course: 'Software Development',
      status: 'Active',
      stage: 'Enrolled',
      loan: 'Approved',
      onBoarded: true
    },
    {
      studentId: 'STU002',
      name: 'Jane Smith',
      category: 'OBC',
      course: 'Software Testing',
      status: 'Active',
      stage: 'Onboarding',
      loan: 'Pending',
      onBoarded: false
    },
    {
      studentId: 'STU003',
      name: 'Bob Johnson',
      category: 'SC',
      course: 'Other Courses',
      status: 'Inactive',
      stage: 'Completed',
      loan: 'Rejected',
      onBoarded: true
    },
    {
      studentId: 'STU004',
      name: 'Alice Brown',
      category: 'ST',
      course: 'Software Development',
      status: 'Active',
      stage: 'Enrolled',
      loan: 'Approved',
      onBoarded: true
    },
    {
      studentId: 'STU005',
      name: 'Charlie Wilson',
      category: 'General',
      course: 'Software Testing',
      status: 'Active',
      stage: 'Onboarding',
      loan: 'Pending',
      onBoarded: false
    }
  ];

  // Unique options for filters
  const courseOptions = Array.from(new Set(tableData.map(row => row.course)));
  const categoryOptions = Array.from(new Set(tableData.map(row => row.category)));
  const statusOptions = Array.from(new Set(tableData.map(row => row.status)));
  const stageOptions = Array.from(new Set(tableData.map(row => row.stage)));

  // Filtered data
  const filteredData = useMemo(() => {
    return tableData.filter(row =>
      (filterCourse ? row.course === filterCourse : true) &&
      (filterCategory ? row.category === filterCategory : true) &&
      (filterStatus ? row.status === filterStatus : true) &&
      (filterStage ? row.stage === filterStage : true) &&
      (filterOnBoarded ? (filterOnBoarded === 'true' ? row.onBoarded : !row.onBoarded) : true) &&
      (searchKeyword
        ? [
            row.studentId,
            row.name,
            row.category,
            row.course,
            row.status,
            row.stage,
            row.loan
          ]
            .join(' ')
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        : true)
    );
  }, [tableData, filterCourse, filterCategory, filterStatus, filterStage, filterOnBoarded, searchKeyword]);

  if (!isAuthenticated) {
    return null;
  }

  // Cards remain unchanged
  const statsCards = [
    {
      title: 'Total Candidates',
      value: '1,250',
      change: '+5.2%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Candidates',
      value: '980',
      change: '+3.1%',
      changeType: 'positive',
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Software Development',
      value: '540',
      change: '+2.8%',
      changeType: 'positive',
      icon: Code,
      color: 'purple'
    },
    {
      title: 'Software Testing',
      value: '320',
      change: '-1.5%',
      changeType: 'negative',
      icon: Bug,
      color: 'orange'
    },
    {
      title: 'Other Courses',
      value: '390',
      change: '+4.0%',
      changeType: 'positive',
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
      label: 'Stage',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-gray-400" />{value}</span>
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
        value ? <BadgeCheck className="w-5 h-5 text-green-500" title="On Boarded" /> : <XCircle className="w-5 h-5 text-red-400" title="Not On Boarded" />
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
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setFilterCourse('');
      setFilterCategory('');
      setFilterStatus('');
      setFilterStage('');
      setFilterOnBoarded('');
      setSearchKeyword('');
      setRefreshing(false);
    }, 800); // Simulate refresh
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            <Card key={index} variant="glass" className="p-6">
              <div className="flex items-center justify-between">
      <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {card.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      from last month
                  </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 ${colorClasses[card.color]}`}>
                  <Icon className="w-6 h-6" />
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
          <Table
            data={filteredData}
            columns={tableColumns}
            variant="glass"
            pagination={true}
            itemsPerPage={5}
            className="mt-4"
          />
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard; 
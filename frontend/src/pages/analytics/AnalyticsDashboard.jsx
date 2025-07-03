import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart3, TrendingUp, DollarSign, Users, BookOpen } from 'lucide-react';
import { fetchAnalyticsDashboard, fetchCourseStats, fetchWeeklyCategoryTrends } from '../../store/slices/analyticsSlice';
import { Card } from '../../components/common';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
  BarChart, Bar,
} from 'recharts';

const COLORS = ['#6366F1', '#F59E42', '#10B981'];

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboard, loading, error, courseStats, courseStatsLoading, courseStatsError, weeklyCategoryTrends, weeklyCategoryTrendsLoading, weeklyCategoryTrendsError } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsDashboard());
    dispatch(fetchCourseStats());
    dispatch(fetchWeeklyCategoryTrends());
  }, [dispatch]);

  // Prepare data for charts
  const statusData = dashboard ? [
    { status: 'Active', value: dashboard.total?.activeCandidates || 0 },
    { status: 'Inactive', value: dashboard.total?.inactiveCandidates || 0 },
    { status: 'Closed', value: dashboard.total?.closedCandidates || 0 },
    { status: 'Completed', value: dashboard.total?.completedCandidates || 0 },
  ] : [];

  // Map backend course keys to friendly names
  const courseNameMap = {
    software_development: 'Software Development',
    software_testing: 'Software Testing',
    othersCourse: 'Others',
  };
  const coursePieData = (courseStats || []).map(cs => ({
    name: courseNameMap[cs._id] || cs._id,
    value: cs.count,
  }));

  // Robust mapping for weekly category trends
  const safeTrends = Array.isArray(weeklyCategoryTrends)
    ? weeklyCategoryTrends
    : Array.isArray(weeklyCategoryTrends?.weeklyData)
      ? weeklyCategoryTrends.weeklyData
      : [];

  const categoryTrendsChartData = safeTrends.map(week => ({
    name: week.weekStart,
    Placement: week.counts?.category?.placement || 0,
    'Interview Support': week.counts?.category?.interview_support || 0,
    'Document Services': week.counts?.category?.document_services || 0,
    'Course Only': week.counts?.category?.course_only || 0,
  }));

  // Debug logs
  console.log('safeTrends:', safeTrends);
  console.log('categoryTrendsChartData:', categoryTrendsChartData);

  const hiringJourneyData = [
    { name: 'Interviews', value: dashboard?.total?.totalInterviews || 0 },
    { name: 'Offers', value: dashboard?.total?.totalOffers || 0 },
  ];

  // Colors for charts
  const radarColor = '#6366F1';
  const pieColors = ['#6366F1', '#F59E42', '#10B981'];
  const areaColors = [
    { key: 'Placement', color: '#6366F1', gradient: 'url(#colorPlacement)' },
    { key: 'Interview Support', color: '#F59E42', gradient: 'url(#colorInterviewSupport)' },
    { key: 'Document Services', color: '#10B981', gradient: 'url(#colorDocumentServices)' },
    { key: 'Course Only', color: '#EF4444', gradient: 'url(#colorCourseOnly)' },
  ];
  const barColor = '#10B981';

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Students',
      value: dashboard?.total?.totalCandidates?.toLocaleString() || '0',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Amount',
      value: `₹${dashboard?.total?.totalAmount?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Received Amount',
      value: `₹${dashboard?.total?.totalReceived?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Balance Amount',
      value: `₹${dashboard?.total?.totalBalance?.toLocaleString() || '0'}`,
      icon: BookOpen,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center h-64 justify-center text-red-600 dark:text-red-400">
        <span className="text-lg font-semibold">Error loading analytics:</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || user?.email || 'User'}! Here's your analytics overview.
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
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            purple: 'text-purple-600 dark:text-purple-400',
            orange: 'text-orange-600 dark:text-orange-400'
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status Distribution */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>Status Distribution</Card.Title>
            <Card.Subtitle>Student status overview</Card.Subtitle>
          </Card.Header>
          <Card.Content className="flex justify-center">
            <RadarChart outerRadius={80} width={300} height={220} data={statusData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, Math.max(...statusData.map(d => d.value), 1)]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Radar name="Status" dataKey="value" stroke={radarColor} fill={radarColor} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </Card.Content>
        </Card>

        {/* Training Stages */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>Training Stages</Card.Title>
            <Card.Subtitle>Progress tracking</Card.Subtitle>
          </Card.Header>
          <Card.Content className="flex justify-center">
            <BarChart width={340} height={180} data={[
              { name: 'Stage 1', value: 0 },
              { name: 'Stage 2', value: 0 },
              { name: 'Stage 3', value: 0 },
              { name: 'Stage 4', value: 0 },
            ]} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#a78bfa', fontSize: 15, fontWeight: 500 }} />
              <YAxis tick={{ fill: '#a78bfa', fontSize: 15, fontWeight: 500 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#a78bfa" barSize={48} />
            </BarChart>
          </Card.Content>
        </Card>

        {/* Course Distribution */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>Course Distribution</Card.Title>
            <Card.Subtitle>Course enrollment breakdown</Card.Subtitle>
          </Card.Header>
          <Card.Content className="flex flex-col items-center">
            {courseStatsLoading ? (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-blue-600 dark:text-blue-400">Loading course data...</span>
              </div>
            ) : courseStatsError ? (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-red-600 dark:text-red-400">{courseStatsError}</span>
              </div>
            ) : coursePieData.some(d => d.value > 0) ? (
              <>
                <PieChart width={300} height={220}>
                  <Pie
                    data={coursePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                  >
                    {coursePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <div className="flex justify-center items-center mt-6 space-x-8 w-full">
                  {coursePieData.map((entry, index) => (
                    <LegendDot key={entry.name} color={pieColors[index % pieColors.length]} label={entry.name} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-gray-400 dark:text-gray-500">No course distribution data available</span>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Category Trends & Hiring Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Trends */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>Category Trends</Card.Title>
            <Card.Subtitle>Service category analysis</Card.Subtitle>
          </Card.Header>
          <Card.Content className="flex flex-col items-center">
            {weeklyCategoryTrendsLoading ? (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-blue-600 dark:text-blue-400">Loading category trends...</span>
              </div>
            ) : weeklyCategoryTrendsError ? (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-red-600 dark:text-red-400">{weeklyCategoryTrendsError}</span>
              </div>
            ) : categoryTrendsChartData.length > 0 ? (
              <LineChart width={320} height={200} data={categoryTrendsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
                <Line type="monotone" dataKey="Placement" stroke="#6366F1" strokeWidth={2} />
                <Line type="monotone" dataKey="Interview Support" stroke="#F59E42" strokeWidth={2} />
                <Line type="monotone" dataKey="Document Services" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Course Only" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-gray-400 dark:text-gray-500">No category trend data available</span>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Hiring Journey */}
        <Card variant="glass">
          <Card.Header>
            <Card.Title>Hiring Journey</Card.Title>
            <Card.Subtitle>Interview and offer tracking</Card.Subtitle>
          </Card.Header>
          <Card.Content className="flex justify-center">
            <BarChart width={400} height={220} data={hiringJourneyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={barColor} barSize={48} />
            </BarChart>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

// LegendDot for custom legend
const LegendDot = ({ color, label }) => (
  <div className="flex items-center space-x-1">
    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
    <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
  </div>
);

export default AnalyticsDashboard; 
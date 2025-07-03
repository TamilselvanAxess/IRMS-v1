import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart3 } from 'lucide-react';
import { fetchAnalyticsDashboard, fetchCourseStats, fetchWeeklyCategoryTrends } from '../../store/slices/analyticsSlice';
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Students"
                value={dashboard?.total?.totalCandidates || 0}
                color="text-green-600"
              />
              <StatCard
                title="Total Amount"
                value={`₹${dashboard?.total?.totalAmount?.toLocaleString() || 0}`}
                color="text-blue-600"
              />
              <StatCard
                title="Received Amount"
                value={`₹${dashboard?.total?.totalReceived?.toLocaleString() || 0}`}
                color="text-purple-600"
              />
              <StatCard
                title="Balance Amount"
                value={`₹${dashboard?.total?.totalBalance?.toLocaleString() || 0}`}
                color="text-orange-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Status Distribution Radar Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 mr-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6m0 0V4m0 10l3-3m-3 3l-3-3" /></svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Status Distribution</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student status overview</p>
                  </div>
                </div>
                <RadarChart outerRadius={80} width={300} height={220} data={statusData} style={{ marginLeft: 24 }}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, Math.max(...statusData.map(d => d.value), 1)]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar name="Status" dataKey="value" stroke={radarColor} fill={radarColor} fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </div>
              {/* Training Stages Placeholder */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 mr-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Training Stages</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Progress tracking</p>
                  </div>
                </div>
                {/* Larger, clearer bar chart for training stages */}
                <div className="flex flex-1 items-center justify-center w-full h-full">
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
                </div>
              </div>
              {/* Course Distribution Donut Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Course Distribution</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Course enrollment breakdown</p>
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
                        // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              </div>
            </div>

            {/* Category Trends & Hiring Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Trends Line Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Category Trends</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Service category analysis</p>
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
              </div>
              {/* Hiring Journey Vertical Bar Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Hiring Journey</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Interview and offer tracking</p>
                <BarChart width={400} height={220} data={hiringJourneyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={barColor} barSize={48} />
                </BarChart>
              </div>
            </div>

            {/* Loading & Error States */}
            {loading && (
              <div className="flex justify-center items-center mt-8">
                <span className="text-blue-600 dark:text-blue-400">Loading analytics...</span>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center mt-8">
                <span className="text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// StatCard component for summary stats
const StatCard = ({ title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="ml-2 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd className={`text-2xl font-semibold ${color} dark:text-white`}>{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// LegendDot for custom legend
const LegendDot = ({ color, label }) => (
  <div className="flex items-center space-x-1">
    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
    <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
  </div>
);

export default AnalyticsDashboard; 
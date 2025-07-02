import React from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

const AnalyticsDashboard = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Active Sessions',
      value: '567',
      change: '+8%',
      changeType: 'positive',
      icon: Activity
    },
    {
      name: 'Revenue',
      value: '$12,345',
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '-2%',
      changeType: 'negative',
      icon: BarChart3
    }
  ];

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
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Icon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              {stat.name}
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {stat.value}
                              </div>
                              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                stat.changeType === 'positive' 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {stat.change}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1 */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    User Growth
                  </h3>
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
                  </div>
                </div>
              </div>

              {/* Chart 2 */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Revenue Trends
                  </h3>
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          New user registered
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 
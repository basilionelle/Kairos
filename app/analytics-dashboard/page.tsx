import { ClientWrapper } from '@/components/ClientWrapper';

const AnalyticsDashboardPage = () => {
  return (
    <ClientWrapper>
      <AnalyticsDashboardContent />
    </ClientWrapper>
  );
};

export default AnalyticsDashboardPage;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAnalyticsSummary, clearAnalytics } from '@/components/ClientAnalytics';

interface PageViewData {
  path: string;
  count: number;
  timestamp: string;
}

interface AnalyticsSummary {
  totalViews: number;
  uniquePaths: number;
  pageViews: PageViewData[];
}

function AnalyticsDashboardContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    try {
      const data = getAnalyticsSummary();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle clearing analytics data
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Loading analytics data...</h1>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Failed to load analytics data</h1>
          <p>There was an error loading the analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Kairos Analytics Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              onClick={loadData}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh Data
            </button>
            <button 
              onClick={handleClearData}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear Data
            </button>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Page Views</h2>
            <p className="text-4xl font-bold text-blue-600">{analyticsData.totalViews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Unique Pages Visited</h2>
            <p className="text-4xl font-bold text-blue-600">{analyticsData.uniquePaths}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Page Views by Path</h2>
          </div>
          {analyticsData.pageViews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No page views recorded yet. Start browsing the site to collect data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.pageViews.map((page, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.path}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            This is a client-side analytics dashboard that stores data in your browser's localStorage.
            Data is only visible to you and will be cleared if you clear your browser data.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageView {
  path: string;
  timestamp: string;
  count: number;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: PageView[];
}

// Fetch real analytics data from our API
const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    const response = await fetch('/api/analytics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure we're not using cached data
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return fallback data if the API fails
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      pageViews: [],
    };
  }
};

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Page Views</h2>
            <p className="text-4xl font-bold text-blue-600">{analyticsData.totalViews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Unique Visitors</h2>
            <p className="text-4xl font-bold text-blue-600">{analyticsData.uniqueVisitors}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Page Views by Path</h2>
          </div>
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
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Note: This is a simple analytics dashboard with mock data. To view real analytics data, 
            you would need to connect to your analytics provider API or implement server-side 
            tracking with a database.
          </p>
        </div>
      </div>
    </div>
  );
}

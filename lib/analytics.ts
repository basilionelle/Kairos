// Simple server-side analytics tracking
import fs from 'fs';
import path from 'path';

interface PageView {
  path: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  ip?: string;
}

interface AnalyticsData {
  pageViews: PageView[];
}

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure analytics directory exists
const ensureAnalyticsFile = () => {
  const dir = path.dirname(ANALYTICS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ pageViews: [] }));
  }
};

// Read analytics data
export const readAnalyticsData = (): AnalyticsData => {
  try {
    ensureAnalyticsFile();
    const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analytics data:', error);
    return { pageViews: [] };
  }
};

// Track page view
export const trackPageView = (pageView: PageView) => {
  try {
    ensureAnalyticsFile();
    const data = readAnalyticsData();
    
    // Add the new page view
    data.pageViews.push({
      ...pageView,
      timestamp: new Date().toISOString(),
    });
    
    // Limit to last 1000 page views to prevent file from growing too large
    if (data.pageViews.length > 1000) {
      data.pageViews = data.pageViews.slice(-1000);
    }
    
    // Write the updated data back to the file
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return false;
  }
};

// Get analytics summary
export const getAnalyticsSummary = () => {
  const data = readAnalyticsData();
  
  // Count total page views
  const totalViews = data.pageViews.length;
  
  // Count unique visitors (based on IP)
  const uniqueIPs = new Set(data.pageViews.map(view => view.ip)).size;
  
  // Count views per page
  const viewsByPath = data.pageViews.reduce((acc, view) => {
    const path = view.path || 'unknown';
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Format for display
  const pageViews = Object.entries(viewsByPath).map(([path, count]) => ({
    path,
    count,
    timestamp: new Date().toISOString().split('T')[0],
  }));
  
  return {
    totalViews,
    uniqueVisitors: uniqueIPs,
    pageViews: pageViews.sort((a, b) => b.count - a.count),
  };
};

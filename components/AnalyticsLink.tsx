'use client';

import Link from 'next/link';

export function AnalyticsLink() {
  return (
    <Link 
      href="/analytics" 
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
    >
      View Analytics
    </Link>
  );
}

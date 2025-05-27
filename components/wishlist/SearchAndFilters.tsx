'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
}

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  setActiveTab,
  isMobile = false
}: SearchAndFiltersProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'study-aids', name: 'Study Aids', icon: '📚' },
    { id: 'productivity', name: 'Productivity', icon: '⏱️' },
    { id: 'scheduling', name: 'Scheduling', icon: '📅' },
    { id: 'campus-life', name: 'Campus Life', icon: '🏫' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
  ];
  
  // Tabs for sorting/filtering
  const tabs = [
    { id: 'top-week', name: 'Top this week' },
    { id: 'trending', name: 'Trending' },
    { id: 'newest', name: 'Newest' },
  ];

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show tooltip only once per session
  useEffect(() => {
    const hasSeenTooltip = sessionStorage.getItem('hasSeenWishlistTooltip');
    
    if (!hasSeenTooltip) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
        sessionStorage.setItem('hasSeenWishlistTooltip', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={`bg-white/90 dark:bg-kairos-darkAccent/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4 border border-gray-100 dark:border-gray-700 ${
      isSticky && !isMobile ? 'sticky top-16 z-10' : ''
    }`}>
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-kairos-primary focus:border-kairos-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Search wishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48"
          >
            💡 Pro tip: Search by title or author name
            <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -mt-4 ml-4"></div>
          </motion.div>
        )}
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-kairos-primary text-kairos-primary dark:border-kairos-accent dark:text-kairos-accent'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-kairos-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

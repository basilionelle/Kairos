'use client';

import { ClientWrapper } from '@/components/ClientWrapper';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../components/ThemeProvider';

// Category type
type Category = 'newest' | 'top-rated' | 'study-aids' | 'organization' | 'college' | 'all';

// App type from Supabase
interface AppData {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon_url: string | null;
  rating: number;
  university: string | null;
  is_new: boolean;
  link: string;
  created_at: string;
  updated_at: string;
}

// Card styles with varied color temperatures and saturations
const CARD_STYLES = [
  // Warm tones (yellows, oranges, reds)
  { bg: 'bg-gradient-to-br from-yellow-400 to-orange-500', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-orange-200/40', stars: 'text-yellow-300', layout: 'horizontal' },
  { bg: 'bg-gradient-to-br from-orange-300 to-red-400', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-red-200/40', stars: 'text-yellow-300', layout: 'vertical' },
  { bg: 'bg-yellow-200', text: 'text-yellow-900', hover: 'hover:scale-[1.02]', shadow: 'shadow-lg shadow-yellow-100/50', stars: 'text-orange-500', layout: 'horizontal' },
  
  // Cool tones (blues, teals, purples)
  { bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-blue-200/40', stars: 'text-yellow-300', layout: 'vertical' },
  { bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-teal-200/40', stars: 'text-yellow-300', layout: 'horizontal' },
  { bg: 'bg-indigo-200', text: 'text-indigo-900', hover: 'hover:scale-[1.02]', shadow: 'shadow-lg shadow-indigo-100/50', stars: 'text-indigo-600', layout: 'vertical' },
  
  // Neutral & pastel tones
  { bg: 'bg-gradient-to-br from-purple-400 to-pink-500', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-purple-200/40', stars: 'text-yellow-300', layout: 'horizontal' },
  { bg: 'bg-emerald-200', text: 'text-emerald-900', hover: 'hover:scale-[1.02]', shadow: 'shadow-lg shadow-emerald-100/50', stars: 'text-emerald-600', layout: 'vertical' },
  { bg: 'bg-gradient-to-br from-rose-400 to-pink-500', text: 'text-white', hover: 'hover:scale-[1.02]', shadow: 'shadow-xl shadow-rose-200/40', stars: 'text-yellow-300', layout: 'horizontal' },
];

// Category colors - light mode (for category pills)
const CATEGORY_COLORS_LIGHT = {
  'newest': [
    { bg: 'bg-yellow-50', text: 'text-yellow-800', hover: 'hover:bg-yellow-100', shadow: 'shadow-xl' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800', hover: 'hover:bg-yellow-200', shadow: 'shadow-xl' },
    { bg: 'bg-amber-50', text: 'text-amber-800', hover: 'hover:bg-amber-100', shadow: 'shadow-xl' },
  ],
  'top-rated': [
    { bg: 'bg-orange-50', text: 'text-orange-800', hover: 'hover:bg-orange-100', shadow: 'shadow-xl' },
    { bg: 'bg-orange-100', text: 'text-orange-800', hover: 'hover:bg-orange-200', shadow: 'shadow-xl' },
    { bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-200', shadow: 'shadow-xl' },
  ],
  'study-aids': [
    { bg: 'bg-red-50', text: 'text-red-800', hover: 'hover:bg-red-100', shadow: 'shadow-xl' },
    { bg: 'bg-rose-50', text: 'text-rose-800', hover: 'hover:bg-rose-100', shadow: 'shadow-xl' },
    { bg: 'bg-pink-50', text: 'text-pink-800', hover: 'hover:bg-pink-100', shadow: 'shadow-xl' },
  ],
  'organization': [
    { bg: 'bg-teal-50', text: 'text-teal-800', hover: 'hover:bg-teal-100', shadow: 'shadow-xl' },
    { bg: 'bg-emerald-50', text: 'text-emerald-800', hover: 'hover:bg-emerald-100', shadow: 'shadow-xl' },
    { bg: 'bg-green-50', text: 'text-green-800', hover: 'hover:bg-green-100', shadow: 'shadow-xl' },
  ],
  'college': [
    { bg: 'bg-indigo-50', text: 'text-indigo-800', hover: 'hover:bg-indigo-100', shadow: 'shadow-xl' },
    { bg: 'bg-violet-50', text: 'text-violet-800', hover: 'hover:bg-violet-100', shadow: 'shadow-xl' },
    { bg: 'bg-purple-50', text: 'text-purple-800', hover: 'hover:bg-purple-100', shadow: 'shadow-xl' },
  ]
};

// Category colors - dark mode (for category pills)
const CATEGORY_COLORS_DARK = {
  'newest': [
    { bg: 'bg-yellow-500/80', text: 'text-white', hover: 'hover:bg-yellow-500/90', shadow: 'shadow-xl shadow-yellow-900/30' },
    { bg: 'bg-yellow-600/80', text: 'text-white', hover: 'hover:bg-yellow-600/90', shadow: 'shadow-xl shadow-yellow-900/30' },
    { bg: 'bg-amber-500/80', text: 'text-white', hover: 'hover:bg-amber-500/90', shadow: 'shadow-xl shadow-amber-900/30' },
  ],
  'top-rated': [
    { bg: 'bg-orange-500/80', text: 'text-white', hover: 'hover:bg-orange-500/90', shadow: 'shadow-xl shadow-orange-900/30' },
    { bg: 'bg-orange-600/80', text: 'text-white', hover: 'hover:bg-orange-600/90', shadow: 'shadow-xl shadow-orange-900/30' },
    { bg: 'bg-amber-600/80', text: 'text-white', hover: 'hover:bg-amber-600/90', shadow: 'shadow-xl shadow-amber-900/30' },
  ],
  'study-aids': [
    { bg: 'bg-red-500/80', text: 'text-white', hover: 'hover:bg-red-500/90', shadow: 'shadow-xl shadow-red-900/30' },
    { bg: 'bg-rose-500/80', text: 'text-white', hover: 'hover:bg-rose-500/90', shadow: 'shadow-xl shadow-rose-900/30' },
    { bg: 'bg-pink-500/80', text: 'text-white', hover: 'hover:bg-pink-500/90', shadow: 'shadow-xl shadow-pink-900/30' },
  ],
  'organization': [
    { bg: 'bg-teal-500/80', text: 'text-white', hover: 'hover:bg-teal-500/90', shadow: 'shadow-xl shadow-teal-900/30' },
    { bg: 'bg-emerald-500/80', text: 'text-white', hover: 'hover:bg-emerald-500/90', shadow: 'shadow-xl shadow-emerald-900/30' },
    { bg: 'bg-green-500/80', text: 'text-white', hover: 'hover:bg-green-500/90', shadow: 'shadow-xl shadow-green-900/30' },
  ],
  'college': [
    { bg: 'bg-indigo-500/80', text: 'text-white', hover: 'hover:bg-indigo-500/90', shadow: 'shadow-xl shadow-indigo-900/30' },
    { bg: 'bg-violet-500/80', text: 'text-white', hover: 'hover:bg-violet-500/90', shadow: 'shadow-xl shadow-violet-900/30' },
    { bg: 'bg-purple-500/80', text: 'text-white', hover: 'hover:bg-purple-500/90', shadow: 'shadow-xl shadow-purple-900/30' },
  ]
};

// Category pill colors
const CATEGORY_PILL_COLORS = {
  'newest': { bg: 'bg-yellow-400', text: 'text-yellow-900', activeBg: 'bg-yellow-500', activeText: 'text-white' },
  'top-rated': { bg: 'bg-orange-400', text: 'text-orange-900', activeBg: 'bg-orange-500', activeText: 'text-white' },
  'study-aids': { bg: 'bg-red-400', text: 'text-red-900', activeBg: 'bg-red-500', activeText: 'text-white' },
  'organization': { bg: 'bg-teal-400', text: 'text-teal-900', activeBg: 'bg-teal-500', activeText: 'text-white' },
  'college': { bg: 'bg-indigo-500', text: 'text-white', activeBg: 'bg-indigo-600', activeText: 'text-white' }
};

// App card type
interface AppCard {
  id: string;
  name: string;
  description: string;
  rating: number;
  category: Category;
  icon: React.ReactNode;
  isNew?: boolean;
  university?: string;
  link: string;
}

function MarketplaceContent() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isSticky, setIsSticky] = useState(false);
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle scroll for sticky category bar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get the appropriate color scheme based on theme
  const getCategoryColors = () => {
    return theme === 'dark' ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  };
  
  // Fetch apps from API
  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query URL with filters
        let url = '/api/marketplace';
        const params = new URLSearchParams();
        
        if (activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch apps');
        }
        
        const data = await response.json();
        setApps(data);
      } catch (err: any) {
        console.error('Error fetching apps:', err);
        setError(err.message || 'Failed to load apps');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApps();
  }, [activeCategory, searchQuery]);

  // Function to render star ratings
  const renderStars = (rating: number, colorClass: string = 'text-yellow-400') => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? colorClass : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Function to render app icon
  const renderAppIcon = (app: AppData) => {
    if (app.icon_url) {
      return (
        <img 
          src={app.icon_url} 
          alt={`${app.name} icon`}
          className="h-10 w-10 object-cover rounded-lg"
        />
      );
    }
    
    // Default icons based on category
    const iconBgColor = app.category === 'study-aids' ? 'bg-blue-400' :
                        app.category === 'organization' ? 'bg-teal-400' :
                        app.category === 'college' ? 'bg-purple-400' : 'bg-yellow-300';
    
    return (
      <div className={`${iconBgColor} p-2 rounded-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    );
  };



  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: theme === 'dark' ? 'url(/images/NIGHTKAIROS.svg)' : 'url(/images/DAYKAIROS.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header with branding */}
      <header className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-kairos-primary dark:text-white font-bold text-4xl tracking-tight leading-none">
          Kairos
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link 
            href="/signin" 
            className="bg-white text-kairos-primary dark:text-kairos-dark px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
        {/* Categories Navigation - with sticky functionality */}
        <div className="mb-8">
          <h2 className="text-kairos-primary dark:text-white text-xl font-light tracking-wide mb-4">
            CATEGORIES
          </h2>
          <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('newest')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'newest'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setActiveCategory('top-rated')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'top-rated'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setActiveCategory('study-aids')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'study-aids'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              Study Aids
            </button>
            <button
              onClick={() => setActiveCategory('organization')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'organization'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              Organization
            </button>
            <button
              onClick={() => setActiveCategory('college')}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'college'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
              }`}
            >
              College
            </button>
          </div>
        </div>

        {/* App Cards */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4 shadow-sm">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No apps found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                              {searchQuery ? 'Try a different search term' : 'No apps available in this category yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* DLSU GPA Calculator Card - Hardcoded */}
            {(activeCategory === 'all' || activeCategory === 'study-aids' || activeCategory === 'college') && (
              <motion.div
                className="bg-gradient-to-br from-green-400 to-teal-500 rounded-xl shadow-xl shadow-teal-200/40 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
              <a href="https://dlsugpacalculator.netlify.app/" target="_blank" rel="noopener noreferrer">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-teal-400 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex space-x-2">
                      <div className="bg-teal-600/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Study Aids
                      </div>
                      <div className="bg-indigo-600/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        College
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">DLSU GPA Calculator</h3>
                  <p className="text-white/90 text-sm mb-3">A simple and intuitive calculator for DLSU students to compute their GPA based on the university's grading system.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-300' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs">De La Salle University</span>
                  </div>
                </div>
              </a>
              </motion.div>
            )}
            
            {/* DLSU Lost and Found Card - Hardcoded */}
            {(activeCategory === 'all' || activeCategory === 'college') && (
              <motion.div
                className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl shadow-xl shadow-purple-200/40 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
              <a href="https://dlsulostandfound.netlify.app/" target="_blank" rel="noopener noreferrer">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-400 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="bg-indigo-600/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      College
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">DLSU Lost and Found</h3>
                  <p className="text-white/90 text-sm mb-3">A platform for DLSU students to report and find lost items on campus. Simplifies the process of recovering lost belongings.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? 'text-yellow-300' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs">De La Salle University</span>
                  </div>
                </div>
              </a>
              </motion.div>
            )}
            
            {/* Dynamically loaded apps */}
            {apps.map((app, index) => {
              // Get a random style for this card
              const style = CARD_STYLES[index % CARD_STYLES.length];
              
              return (
                <motion.div
                  key={app.id}
                  className={`${style.bg} rounded-xl ${style.shadow} ${style.hover} transition-all duration-300 overflow-hidden`}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {style.layout === 'horizontal' ? (
                    <a href={app.link} target="_blank" rel="noopener noreferrer">
                      <div className="flex h-full p-6">
                        <div className="mr-4 flex-shrink-0">
                          {renderAppIcon(app)}
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className={`text-lg font-semibold ${style.text} mr-2`}>{app.name}</h3>
                            {app.is_new && (
                              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                            )}
                          </div>
                          <p className={`text-sm ${style.text === 'text-white' ? 'text-white/90' : 'opacity-80'}`}>
                            {app.description}
                          </p>
                          <div className="mt-2">
                            {renderStars(app.rating, style.stars)}
                          </div>
                          {app.university && (
                            <div className="mt-1">
                              <span className={`text-xs ${style.text === 'text-white' ? 'text-white/80' : 'text-gray-600'}`}>
                                {app.university}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <a href={app.link} target="_blank" rel="noopener noreferrer">
                      <div className="flex flex-col space-y-2 h-full p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white/10 shadow-inner shadow-black/10">
                            {renderAppIcon(app)}
                          </div>
                          <h3 className={`text-lg font-semibold ${style.text} leading-tight`}>
                            {app.name}
                          </h3>
                        </div>
                        <p className={`text-sm ${style.text === 'text-white' ? 'text-white/90' : 'opacity-80'} leading-tight`}>
                          {app.description}
                        </p>
                        <div className="mt-auto pt-2 border-t border-white/10">
                          {renderStars(app.rating, style.stars)}
                        </div>
                        {app.university && (
                          <div className="mt-1">
                            <span className={`text-xs ${style.text === 'text-white' ? 'text-white/80' : 'text-gray-600'}`}>
                              {app.university}
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const MarketplacePage = () => {
  return (
    <ClientWrapper>
      <MarketplaceContent />
    </ClientWrapper>
  );
};

export default MarketplacePage;

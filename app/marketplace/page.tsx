'use client';

import { ClientWrapper } from '@/components/ClientWrapper';
import  SignInButton  from '@/components/SignInButton';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../components/ThemeProvider';
import { useSupabase } from '@/components/SupabaseProvider'
import type { Session } from '@supabase/supabase-js'

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

function MarketplaceLink({isLoggedIn} : {isLoggedIn : Session | null}) {
  if (isLoggedIn) {
    return <Link 
            href="/marketplace-upload" 
            className="bg-white text-kairos-primary dark:text-kairos-dark px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm"
          >
            Upload Tool
          </Link>
  }
  return null;
}

function SignInMobile({isLoggedIn, setMobileMenuOpen} : {isLoggedIn : Session | null}) {
  if (isLoggedIn) {
    return <Link 
              href="/dashboard" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>;
  }
  return <Link 
              href="/signin" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>;
}

function MarketplaceLinkMobile({isLoggedIn, setMobileMenuOpen} : {isLoggedIn : Session | null}) {
  if (isLoggedIn) {
    return <Link 
              href="/marketplace-upload" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Tool
            </Link>
  } else {
    return null;
  }
}

function MarketplaceContent() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [session, setSession] = useState<Session | null>(null)
  const { supabase } = useSupabase();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])
  
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
          <button 
            onClick={() => setShowContactPopup(true)}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-sm"
          >
            Contact Us
          </button>

          <MarketplaceLink isLoggedIn={session} />

          <Link 
            href="/wishlist" 
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Wishlist
          </Link>
          <SignInButton></SignInButton>
        </div>

        {mobileMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out"
        >
          <div className="py-1">
            <Link 
              href="/" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/marketplace" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <MarketplaceLinkMobile isLoggedIn={session} setMobileMenuOpen={setMobileMenuOpen} />
            <Link 
              href="/wishlist" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                Wishlist
              </span>
            </Link>
            <SignInMobile isLoggedIn={session} setMobileMenuOpen={setMobileMenuOpen} />
          </div>
        </div>
      )}

      </header>

      {/* Contact Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Email: </span>
                <a href="mailto:moodevelopers@gmail.com" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">moodevelopers@gmail.com</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l.66 1.6L9.1 8.66 15 14l6.1-5.34.66 1.6-6.76 5.92L9.1 10.34 3 15.92V10z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Instagram: </span>
                <a href="https://instagram.com/kairos__ph" target="_blank" rel="noopener noreferrer" className="ml-2 text-pink-600 dark:text-pink-400 hover:underline">@kairos__ph</a>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <a href={app.link} target="_blank" rel="noopener noreferrer">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">

                      <div className="mr-4 flex-shrink-0">
                        {renderAppIcon(app)}
                      </div>

                      <div className="flex space-x-2">
                        {app.is_new && (
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>

                    </div>
                    <h3 className="text-white text-lg font-semibold mb-1">{app.name}</h3>
                    <p className="text-white/90 text-sm mb-3">{app.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="mt-2">
                        {renderStars(app.rating, style.stars)}
                      </div>
                      <span className="text-white/80 text-xs">{app.university}</span>
                    </div>
                  </div>
                </a>
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

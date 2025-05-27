'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClientWrapper } from '@/components/ClientWrapper';
import WishlistSubmission from '@/components/wishlist/WishlistSubmission';
import WishlistFeed from '@/components/wishlist/WishlistFeed';
import WishlistLeaderboard from '@/components/wishlist/WishlistLeaderboard';
import AchievementPanel from '@/components/wishlist/AchievementPanel';
import SearchAndFilters from '@/components/wishlist/SearchAndFilters';
import { useTheme } from '@/components/ThemeProvider';

export default function WishlistPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('top-week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileSubmit, setShowMobileSubmit] = useState(false);

  return (
    <ClientWrapper>
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: theme === 'dark' ? 'url(/images/NIGHTKAIROS.svg)' : 'url(/images/DAYKAIROS.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-kairos-primary dark:text-white mb-2">
              What's Your Campus Wish?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Submit your ideas and upvote your favorites
            </p>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-6">
              {/* Left Column: Submit Panel & Leaderboard */}
              <div className="col-span-3">
                <WishlistSubmission />
                <div className="mt-6">
                  <WishlistLeaderboard />
                </div>
              </div>

              {/* Middle Column: Feed & Search */}
              <div className="col-span-6">
                <SearchAndFilters 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <WishlistFeed 
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  activeTab={activeTab}
                />
              </div>

              {/* Right Column: Achievements */}
              <div className="col-span-3">
                <AchievementPanel />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {!showMobileSubmit ? (
                <>
                  <SearchAndFilters 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobile={true}
                  />
                  <WishlistFeed 
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    activeTab={activeTab}
                    isMobile={true}
                  />
                </>
              ) : (
                <WishlistSubmission isMobile={true} onClose={() => setShowMobileSubmit(false)} />
              )}
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-kairos-dark border-t border-gray-200 dark:border-gray-800 flex items-center justify-around py-3 px-4 z-10">
              <button 
                className={`flex flex-col items-center ${!showMobileSubmit ? 'text-kairos-primary' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setShowMobileSubmit(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs mt-1">Home</span>
              </button>
              <button 
                className={`flex flex-col items-center ${showMobileSubmit ? 'text-kairos-primary' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setShowMobileSubmit(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs mt-1">Submit</span>
              </button>
              <button 
                className="flex flex-col items-center text-gray-500 dark:text-gray-400"
                onClick={() => window.location.href = '/wishlist/leaderboard'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs mt-1">Leaderboard</span>
              </button>
              <button 
                className="flex flex-col items-center text-gray-500 dark:text-gray-400"
                onClick={() => window.location.href = '/profile'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}

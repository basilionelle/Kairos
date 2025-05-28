'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, subscribeToWishes, subscribeToWishVotes } from '@/lib/supabaseClient';

interface Wish {
  id: string;
  title: string;
  category: string;
  authorName: string;
  authorAvatar: string;
  votes: number;
  comments: number;
  createdAt: string;
  badges: string[];
  buildThreshold: number;
  percentComplete: number;
}

interface WishlistFeedProps {
  searchQuery: string;
  selectedCategory: string;
  activeTab: string;
  isMobile?: boolean;
}

export default function WishlistFeed({
  searchQuery,
  selectedCategory,
  activeTab,
  isMobile = false
}: WishlistFeedProps) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedWishes, setVotedWishes] = useState<Set<string>>(new Set());

  // Empty initial state - no mock data
  const mockWishes: Wish[] = [];

  // Fetch wishes from API and subscribe to real-time updates
  // Check for highlighted wish from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId) {
      // Wait for wishes to load and DOM to update
      setTimeout(() => {
        const wishElement = document.getElementById(`wish-${highlightId}`);
        if (wishElement) {
          wishElement.scrollIntoView({ behavior: 'smooth' });
          wishElement.classList.add('highlight-wish');
          setTimeout(() => {
            wishElement.classList.remove('highlight-wish');
          }, 2000);
        }
      }, 1000);
    }
  }, []);
  
  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Determine sort parameter based on activeTab
        let sortParam = '';
        switch (activeTab) {
          case 'top-week':
            sortParam = 'votes';
            break;
          case 'trending':
            sortParam = 'trending';
            break;
          case 'newest':
            sortParam = 'newest';
            break;
          default:
            sortParam = 'votes';
        }
        
        // Build query URL with filters
        let url = '/api/wishes';
        const params = new URLSearchParams();
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        params.append('sort', sortParam);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        // Fetch wishes from API
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishes');
        }
        
        const data = await response.json();
        
        // Transform API data to match our Wish interface
        const transformedWishes = data.map((wish: any) => ({
          id: wish.id,
          title: wish.title,
          category: wish.category,
          authorName: wish.author_name,
          authorAvatar: wish.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(wish.author_name)}&background=random`,
          votes: wish.votes,
          comments: wish.comments || 0,
          createdAt: wish.created_at,
          badges: wish.badges || [],
          buildThreshold: 100, // This could be dynamic based on category
          percentComplete: Math.min(100, ((wish.votes / 100) * 100))
        }));
        
        setWishes(transformedWishes);
      } catch (err) {
        console.error('Error fetching wishes:', err);
        setError('Failed to load wishes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishes();
    
    // Subscribe to real-time updates for wishes
    const unsubscribeWishes = subscribeToWishes((payload) => {
      const { eventType, new: newWish, old: oldWish } = payload;
      
      // Handle different event types
      if (eventType === 'INSERT') {
        // Add new wish to the list
        setWishes((prevWishes) => {
          // Transform the new wish to match our Wish interface
          const transformedWish = {
            id: newWish.id,
            title: newWish.title,
            category: newWish.category,
            authorName: newWish.author_name,
            authorAvatar: newWish.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newWish.author_name)}&background=random`,
            votes: newWish.votes,
            comments: newWish.comments || 0,
            createdAt: newWish.created_at,
            badges: newWish.badges || [],
            buildThreshold: 100,
            percentComplete: Math.min(100, ((newWish.votes / 100) * 100))
          };
          
          // Filter based on current filters
          if (selectedCategory !== 'all' && transformedWish.category !== selectedCategory) {
            return prevWishes;
          }
          
          if (searchQuery && !transformedWish.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return prevWishes;
          }
          
          // Add the new wish to the beginning of the list if sorting by newest
          if (activeTab === 'newest') {
            return [transformedWish, ...prevWishes];
          }
          
          // Otherwise add it to the end and let the sorting handle it
          return [...prevWishes, transformedWish];
        });
      } else if (eventType === 'UPDATE') {
        // Update existing wish
        setWishes((prevWishes) => 
          prevWishes.map((wish) => 
            wish.id === newWish.id
              ? {
                  ...wish,
                  title: newWish.title,
                  category: newWish.category,
                  votes: newWish.votes,
                  comments: newWish.comments || 0,
                  badges: newWish.badges || [],
                  percentComplete: Math.min(100, ((newWish.votes / 100) * 100))
                }
              : wish
          )
        );
      } else if (eventType === 'DELETE') {
        // Remove deleted wish
        setWishes((prevWishes) => 
          prevWishes.filter((wish) => wish.id !== oldWish.id)
        );
      }
    });
    
    // Subscribe to real-time updates for wish votes
    const unsubscribeVotes = subscribeToWishVotes((payload) => {
      if (payload.eventType === 'INSERT') {
        // Update vote count for the affected wish
        const wishId = payload.new.wish_id;
        
        setWishes((prevWishes) => 
          prevWishes.map((wish) => {
            if (wish.id === wishId) {
              const newVotes = wish.votes + 1;
              return {
                ...wish,
                votes: newVotes,
                percentComplete: Math.min(100, ((newVotes / wish.buildThreshold) * 100))
              };
            }
            return wish;
          })
        );
      }
    });
    
    // Cleanup subscriptions when component unmounts
    return () => {
      unsubscribeWishes();
      unsubscribeVotes();
    };
  }, [activeTab, searchQuery, selectedCategory]);

  // Retrieve voted wishes from localStorage
  useEffect(() => {
    const storedVotes = localStorage.getItem('votedWishes');
    if (storedVotes) {
      setVotedWishes(new Set(JSON.parse(storedVotes)));
    }
  }, []);

  const handleVote = async (wishId: string) => {
    if (votedWishes.has(wishId)) {
      return; // Already voted
    }
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If not authenticated, redirect to sign in page
        window.location.href = '/signin?redirect=/wishlist';
        return;
      }
      
      // Optimistic update
      setWishes(prevWishes => 
        prevWishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, votes: wish.votes + 1, percentComplete: Math.min(100, ((wish.votes + 1) / wish.buildThreshold) * 100) } 
            : wish
        )
      );
      
      // Update local storage
      const newVotedWishes = new Set(votedWishes);
      newVotedWishes.add(wishId);
      setVotedWishes(newVotedWishes);
      localStorage.setItem('votedWishes', JSON.stringify(Array.from(newVotedWishes)));
      
      // Send vote to API
      const response = await fetch('/api/wishes/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote for wish');
      }
      
      // Show success toast
      const successToast = document.createElement('div');
      successToast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      successToast.textContent = 'Vote recorded!';
      document.body.appendChild(successToast);
      
      // Remove toast after 2 seconds
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 2000);
    } catch (error) {
      console.error('Error voting for wish:', error);
      
      // Revert optimistic update if there's an error
      setWishes(prevWishes => 
        prevWishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, votes: wish.votes - 1, percentComplete: ((wish.votes - 1) / wish.buildThreshold) * 100 } 
            : wish
        )
      );
      
      // Remove from voted set
      const revertVotedWishes = new Set(votedWishes);
      revertVotedWishes.delete(wishId);
      setVotedWishes(revertVotedWishes);
      localStorage.setItem('votedWishes', JSON.stringify(Array.from(revertVotedWishes)));
      
      // Show error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
      errorToast.textContent = error instanceof Error ? error.message : 'Failed to vote for wish';
      document.body.appendChild(errorToast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 3000);
    }
  };

  // Function to render badges for each wish
  const renderBadges = (badges: string[]) => {
    return badges.map(badge => {
      switch (badge) {
        case 'first-wish':
          return (
            <span key={badge} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
              🏆 First Wish
            </span>
          );
        case 'community-favorite':
          return (
            <span key={badge} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              ❤️ Community Favorite
            </span>
          );
        case 'problem-solver':
          return (
            <span key={badge} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              🔧 Problem Solver
            </span>
          );
        case 'trend-spotter':
          return (
            <span key={badge} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
              📈 Trend Spotter
            </span>
          );
        default:
          return null;
      }
    });
  };

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-kairos-darkAccent rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="ml-2 h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-kairos-primary text-white rounded-md hover:bg-kairos-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="mt-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No wishes found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or be the first to submit a wish!</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <AnimatePresence>
        {wishes.map((wish, index) => (
          <motion.div
            id={`wish-${wish.id}`}
            key={wish.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="p-4">
              <div className="flex items-start">
                {/* Vote button */}
                <div className="mr-4 flex flex-col items-center">
                  <button
                    onClick={() => handleVote(wish.id)}
                    disabled={votedWishes.has(wish.id)}
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kairos-primary ${
                      votedWishes.has(wish.id)
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-800/30'
                    }`}
                    aria-label="Upvote"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 ${
                        votedWishes.has(wish.id) 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-orange-500 dark:text-orange-400'
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="mt-1 text-sm font-medium">{wish.votes}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-tight mb-1">
                        {wish.title}
                      </h3>
                      
                      {/* Author info and timestamp */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <img 
                          src={wish.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(wish.authorName)}&background=random`} 
                          alt={wish.authorName}
                          className="w-5 h-5 rounded-full mr-1"
                        />
                        <span>{wish.authorName}</span>
                        <span className="mx-1">•</span>
                        <span>{formatRelativeTime(wish.createdAt)}</span>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {renderBadges(wish.badges)}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            wish.percentComplete >= 100
                              ? 'bg-green-500 dark:bg-green-600'
                              : 'bg-kairos-primary dark:bg-kairos-accent'
                          }`}
                          style={{ width: `${wish.percentComplete}%` }}
                        ></div>
                      </div>
                      
                      {/* Build threshold info */}
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {wish.percentComplete >= 100 
                            ? '✓ Build threshold reached!' 
                            : `${wish.votes}/${wish.buildThreshold} votes to build threshold`}
                        </span>
                        <button className="flex items-center text-kairos-primary dark:text-kairos-accent hover:underline">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span>{wish.comments} comments</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category tag and social proof for top wishes */}
            {wish.votes >= 100 && (
              <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-800/30 flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  🔥 {wish.votes} students support this wish
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  wish.category === 'study-aids' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' 
                    : wish.category === 'productivity'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                    : wish.category === 'scheduling'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                    : wish.category === 'campus-life'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                    : 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
                }`}>
                  {wish.category === 'study-aids' ? '📚 Study Aids' : 
                   wish.category === 'productivity' ? '⏱️ Productivity' : 
                   wish.category === 'scheduling' ? '📅 Scheduling' : 
                   wish.category === 'campus-life' ? '🏫 Campus Life' : 
                   '🧘 Wellness'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

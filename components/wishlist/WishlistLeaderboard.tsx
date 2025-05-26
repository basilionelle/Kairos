'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  tier: 'bronze' | 'silver' | 'gold';
  change: number; // Positive for up, negative for down, 0 for no change
}

export default function WishlistLeaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockUsers: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Fays B.',
      avatar: '/avatars/user1.png',
      points: 6250,
      rank: 1,
      tier: 'gold',
      change: 0
    },
    {
      id: '2',
      name: 'Emma L.',
      avatar: '/avatars/user2.png',
      points: 4980,
      rank: 2,
      tier: 'silver',
      change: -3
    },
    {
      id: '3',
      name: 'James R.',
      avatar: '/avatars/user3.png',
      points: 3780,
      rank: 3,
      tier: 'silver',
      change: 38
    },
    {
      id: '4',
      name: 'Sofia C.',
      avatar: '/avatars/user4.png',
      points: 2530,
      rank: 4,
      tier: 'bronze',
      change: -1
    },
    {
      id: '5',
      name: 'Raheem K.',
      avatar: '/avatars/user5.png',
      points: 1820,
      rank: 5,
      tier: 'bronze',
      change: 2
    }
  ];

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const getTierIcon = (tier: 'bronze' | 'silver' | 'gold') => {
    switch (tier) {
      case 'gold':
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
          </svg>
        );
      case 'silver':
        return (
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
          </svg>
        );
      case 'bronze':
        return (
          <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-green-600 dark:text-green-400">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="inline-flex items-center text-red-600 dark:text-red-400">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {Math.abs(change)}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
          0
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-kairos-darkAccent rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-kairos-primary dark:text-white mb-4">
          Community Leaderboard
        </h2>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-3 py-3 animate-pulse">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-kairos-darkAccent rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-kairos-primary dark:text-white mb-4">
        Community Leaderboard
      </h2>
      <div className="space-y-1">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center py-3 px-2 rounded-lg ${
              index === 0
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : index === 1
                ? 'bg-gray-50 dark:bg-gray-800/50'
                : index === 2
                ? 'bg-amber-50 dark:bg-amber-900/20'
                : ''
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {user.rank}
              </span>
            </div>
            <div className="mr-3">
              {getTierIcon(user.tier)}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.points.toLocaleString()} pts
              </div>
              <div className="text-xs">
                {getChangeIcon(user.change)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a 
          href="/wishlist/leaderboard" 
          className="text-sm text-kairos-primary dark:text-kairos-accent hover:underline"
        >
          View Full Leaderboard
        </a>
      </div>
    </div>
  );
}

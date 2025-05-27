'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export default function AchievementPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  // Achievement definitions without unlocked status
  const mockAchievements: Achievement[] = [
    {
      id: 'first-wish',
      title: 'First Wish',
      description: 'Submit your first wish',
      icon: '🏆',
      unlocked: false,
      color: 'bg-yellow-500'
    },
    {
      id: 'community-favorite',
      title: 'Community Favorite',
      description: 'Get 100+ votes on a wish',
      icon: '❤️',
      unlocked: false,
      color: 'bg-blue-500'
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      description: 'Have a wish completed',
      icon: '🔧',
      unlocked: false,
      color: 'bg-green-500'
    },
    {
      id: 'trend-spotter',
      title: 'Trend Spotter',
      description: 'Wish gains fastest votes in 24h',
      icon: '📈',
      unlocked: false,
      color: 'bg-purple-500'
    }
  ];

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 800));
        setAchievements(mockAchievements);
        setStreak(0); // Reset streak data
        setTotalXP(0); // Reset XP data
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, []);

  const renderStreakIndicator = () => {
    const days = [
      { day: 'M', active: streak >= 1 },
      { day: 'T', active: streak >= 2 },
      { day: 'W', active: streak >= 3 },
      { day: 'T', active: streak >= 4 },
      { day: 'F', active: streak >= 5 },
      { day: 'S', active: streak >= 6 },
      { day: 'S', active: streak >= 7 }
    ];

    return (
      <div className="flex justify-between mt-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                day.active 
                  ? 'bg-kairos-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {day.day}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-kairos-darkAccent rounded-lg shadow-lg p-4 sticky top-24">
        <h2 className="text-xl font-bold text-kairos-primary dark:text-white mb-4">
          Achievements
        </h2>
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-kairos-darkAccent/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-100 dark:border-gray-700 sticky top-24">
      <h2 className="text-xl font-bold text-kairos-primary dark:text-white mb-4">
        Achievements
      </h2>
      
      {/* XP Card */}
      <div className="bg-gradient-to-r from-kairos-primary to-kairos-accent rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Total XP</h3>
            <p className="text-white text-2xl font-bold">{totalXP}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
      </div>
      
      {/* Streak Card */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-white font-bold">Current Streak</h3>
            <p className="text-white text-xl font-bold">{streak} days</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🔥</span>
          </div>
        </div>
        {renderStreakIndicator()}
        <p className="text-white/80 text-xs mt-2">
          {streak === 7 
            ? '7-day streak complete! +30 bonus points awarded!' 
            : `${7 - streak} more days for streak bonus`}
        </p>
      </div>
      
      {/* Badges */}
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Your Badges</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-lg p-3 ${
              achievement.unlocked
                ? `${achievement.color}/10 border border-${achievement.color}/20`
                : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                  achievement.unlocked
                    ? `${achievement.color}/20`
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {achievement.unlocked ? (
                  <span>{achievement.icon}</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <h4 className={`font-medium text-sm ${
                achievement.unlocked
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {achievement.unlocked ? 'Unlocked' : achievement.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Explore button */}
      <button className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium transition-colors">
        Explore New Tools
      </button>
    </div>
  );
}

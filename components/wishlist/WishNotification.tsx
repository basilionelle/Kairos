'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToWishes } from '@/lib/supabaseClient';

interface WishNotificationProps {
  onViewWish?: (wishId: string) => void;
}

export default function WishNotification({ onViewWish }: WishNotificationProps) {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    authorName: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    // Subscribe to real-time wish updates
    const unsubscribeWishes = subscribeToWishes((payload) => {
      const { eventType, new: newWish } = payload;
      
      // Only show notifications for new wishes
      if (eventType === 'INSERT') {
        const newNotification = {
          id: newWish.id,
          title: newWish.title,
          authorName: newWish.author_name,
          timestamp: Date.now(),
        };
        
        setNotifications(prev => [...prev, newNotification]);
        
        // Auto-dismiss notification after 10 seconds
        setTimeout(() => {
          setNotifications(prev => 
            prev.filter(notification => notification.id !== newWish.id)
          );
        }, 10000);
      }
    });
    
    return () => {
      unsubscribeWishes();
    };
  }, []);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleClick = (id: string) => {
    if (onViewWish) {
      onViewWish(id);
    }
    handleDismiss(id);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg max-w-sm w-full cursor-pointer"
            onClick={() => handleClick(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold">New Wish Added!</h4>
                <p className="text-sm font-medium mt-1">{notification.title}</p>
                <p className="text-xs opacity-80 mt-1">by {notification.authorName}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(notification.id);
                }}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-2 w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

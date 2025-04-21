'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Initialize with a default theme to avoid hydration issues
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme once on component mount
  useEffect(() => {
    setMounted(true);
    if (!isBrowser) return;
    
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme as Theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [isBrowser]);

  // Update theme in localStorage and document when it changes
  useEffect(() => {
    if (!isBrowser || !mounted) return;
    
    try {
      localStorage.setItem('theme', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      console.log('Theme updated to:', theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme, isBrowser, mounted]);

  const toggleTheme = () => {
    console.log('Toggling theme from', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New theme will be:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

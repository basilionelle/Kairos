'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from '../../components/ThemeToggle';
import { useTheme } from '../../components/ThemeProvider';

// Category type
type Category = 'newest' | 'top-rated' | 'study-aids' | 'organization' | 'college';

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

export default function Marketplace() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('newest');
  const [isSticky, setIsSticky] = useState(false);
  
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

  // Dummy app data
  const apps: AppCard[] = [
    {
      id: '1',
      name: 'Class Scheduler',
      description: 'Plan your weekly class timetable',
      rating: 4,
      category: 'newest',
      isNew: true,
      icon: (
        <div className="bg-yellow-300 p-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '2',
      name: 'Flashcard Maker',
      description: 'Create flashcards for any subject',
      rating: 5,
      category: 'newest',
      icon: (
        <div className="bg-red-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '3',
      name: 'AS Autoclicker',
      description: 'Have your computer spam click to snipe some slots',
      rating: 4,
      category: 'newest',
      icon: (
        <div className="bg-teal-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      ),
      link: 'https://github.com/plvzfq-rit/AS-Autoenlister/releases/latest'
    },
    {
      id: '4',
      name: 'Note Taker',
      description: 'Organize and review your notes',
      rating: 5,
      category: 'top-rated',
      icon: (
        <div className="bg-orange-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '5',
      name: 'Task Tracker',
      description: 'Stay on top of your assignments',
      rating: 4,
      category: 'top-rated',
      icon: (
        <div className="bg-teal-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '6',
      name: 'Study Timer',
      description: 'Use a timer for focused sessions',
      rating: 4,
      category: 'top-rated',
      icon: (
        <div className="bg-yellow-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '7',
      name: 'Citation Helper',
      description: 'Generate accurate citations',
      rating: 4,
      category: 'study-aids',
      icon: (
        <div className="bg-blue-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '8',
      name: 'Study Group Finder',
      description: 'Locate or join student study groups',
      rating: 4,
      category: 'study-aids',
      icon: (
        <div className="bg-blue-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '9',
      name: 'Quiz Wizard',
      description: 'Ace quizzes with custom practice',
      rating: 5,
      category: 'study-aids',
      icon: (
        <div className="bg-green-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '10',
      name: 'Assignment Planner',
      description: 'Track deadlines and plan ahead',
      rating: 4,
      category: 'organization',
      icon: (
        <div className="bg-teal-400 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '11',
      name: 'DLSU Course Finder',
      description: 'Find courses at De La Salle University',
      rating: 4,
      category: 'college',
      university: 'DLSU',
      icon: (
        <div className="bg-green-800 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '12',
      name: 'UP Schedule Builder',
      description: 'Build your UP class schedule',
      rating: 5,
      category: 'college',
      university: 'UP',
      icon: (
        <div className="bg-red-900 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '13',
      name: 'ADMU Library Finder',
      description: 'Locate books in the ADMU library',
      rating: 4,
      category: 'college',
      university: 'ADMU',
      icon: (
        <div className="bg-blue-900 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      ),
      link: '#'
    },
    {
      id: '14',
      name: 'UST Campus Map',
      description: 'Navigate the UST campus easily',
      rating: 4,
      category: 'college',
      university: 'UST',
      icon: (
        <div className="bg-yellow-500 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
      ),
      link: '#'
    },
  ];

  // Function to render star ratings with improved visibility
  const renderStars = (rating: number, starColor: string = 'text-[#FEC43F]') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? starColor : 'text-white/30'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex gap-x-1">{stars}</div>;
  };
  
  // Function to get a card style with variety
  const getCardStyle = (appId: string) => {
    // Use the app ID to consistently assign the same style to the same app
    const styleIndex = parseInt(appId.replace(/\D/g, '')) % CARD_STYLES.length;
    return CARD_STYLES[styleIndex];
  };
  
  // Function to get a random style from category colors (for category pills)
  const getRandomStyle = (category: Category) => {
    const colors = getCategoryColors()[category];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Filter apps by active category
  const filteredApps = apps.filter((app: AppCard) => app.category === activeCategory);

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
      <header className="w-full py-8 px-6 md:px-10 flex justify-between items-center max-w-screen-xl mx-auto">
        <Link href="/" className="text-kairos-primary dark:text-white font-bold text-4xl tracking-tight leading-none">Kairos</Link>
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
        <div className={`${isSticky ? 'sticky top-0 z-50 pt-4 pb-4 ' + (theme === 'dark' ? 'bg-kairos-dark' : 'bg-kairos-primary') + ' bg-opacity-95 shadow-lg transition-all duration-300' : 'mb-8'}`}>
          <h2 className="text-kairos-primary dark:text-white text-xl font-light tracking-wide mb-4">CATEGORIES</h2>
          <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide">
            {Object.entries(CATEGORY_PILL_COLORS).map(([category, colors]) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category as Category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category
                    ? colors.activeBg + ' ' + colors.activeText + ' font-medium shadow-lg'
                    : theme === 'dark' 
                      ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20' 
                      : 'bg-white/80 text-kairos-primary hover:bg-white shadow'
                }`}
              >
                <span className="flex items-center">
                  <span 
                    className={`h-3 w-3 rounded-full mr-2 ${colors.bg}`}
                  ></span>
                  {category === 'newest' && 'Newest'}
                  {category === 'top-rated' && 'Top Rated'}
                  {category === 'study-aids' && 'Study Aids'}
                  {category === 'organization' && 'Organization'}
                  {category === 'college' && 'College'}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* App Cards */}
        <div className="mt-10">
          {activeCategory === 'newest' && (
            <h2 className={`${theme === 'dark' ? 'text-white bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text' : 'text-kairos-primary'} text-3xl md:text-4xl font-bold mb-8`}>Newest Gems</h2>
          )}
          {activeCategory === 'top-rated' && (
            <h2 className={`${theme === 'dark' ? 'text-white bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text' : 'text-kairos-primary'} text-3xl md:text-4xl font-bold mb-8`}>Top Rated</h2>
          )}
          {activeCategory === 'study-aids' && (
            <h2 className={`${theme === 'dark' ? 'text-white bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text' : 'text-kairos-primary'} text-3xl md:text-4xl font-bold mb-8`}>Study Aids</h2>
          )}
          {activeCategory === 'organization' && (
            <h2 className={`${theme === 'dark' ? 'text-white bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text' : 'text-kairos-primary'} text-3xl md:text-4xl font-bold mb-8`}>Organization</h2>
          )}
          {activeCategory === 'college' && (
            <h2 className={`${theme === 'dark' ? 'text-white bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text' : 'text-kairos-primary'} text-3xl md:text-4xl font-bold mb-8`}>College</h2>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredApps.map((app) => {
              const style = getCardStyle(app.id);
              return (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.3 }}
                  className={`${style.bg} rounded-xl p-5 ${style.shadow} ${style.hover} transition-all duration-300 relative overflow-hidden`}
                >
                  {/* New badge positioned to match card shape */}
                  {app.isNew && (
                    <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-0.5 text-black rounded-md shadow-sm">
                      NEW
                    </div>
                  )}
                  {style.layout === 'horizontal' ? (
                    <a href={app.link}>
                      <div className="flex flex-col space-y-2 h-full justify-start text-left">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/10 shadow-inner shadow-black/10">
                            {app.icon}
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
                      </div>
                    </a>
                  ) : (
                    <a href={app.link}>
                      <div className="flex flex-col space-y-2 h-full justify-start text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white/10 shadow-inner shadow-black/10">
                            {app.icon}
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
                      </div>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

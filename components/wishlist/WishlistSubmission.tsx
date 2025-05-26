'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WishlistSubmissionProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function WishlistSubmission({ isMobile = false, onClose }: WishlistSubmissionProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [mockupLink, setMockupLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(200);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const categories = [
    { id: 'study-aids', name: 'Study Aids', icon: '📚' },
    { id: 'productivity', name: 'Productivity', icon: '⏱️' },
    { id: 'scheduling', name: 'Scheduling', icon: '📅' },
    { id: 'campus-life', name: 'Campus Life', icon: '🏫' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
  ];

  useEffect(() => {
    // Auto-focus on title input when component mounts
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Update characters left counter
    setCharactersLeft(200 - title.length);
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= 200) {
      setTitle(newTitle);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after successful submission
      setTitle('');
      setCategory('');
      setDescription('');
      setMockupLink('');
      setStep(1);
      
      // Show success toast (implement toast notification system)
      console.log('Wish submitted successfully!');
      
      // Close mobile form if on mobile
      if (isMobile && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={`bg-white dark:bg-kairos-darkAccent rounded-lg shadow-lg p-4 ${isMobile ? 'h-[calc(100vh-120px)]' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-kairos-primary dark:text-white">Submit Your Wish</h2>
        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
        <div 
          className="bg-kairos-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      {/* Step 1: Title */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <label htmlFor="wish-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What's your wish? <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="wish-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="E.g., A scholarship finder for our university"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-kairos-primary focus:border-kairos-primary dark:bg-gray-800 dark:text-white"
              required
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${charactersLeft < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                {charactersLeft} characters left
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Category */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose a category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center space-x-1 p-2 rounded-md transition ${
                    category === cat.id
                      ? 'bg-kairos-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your wish..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-kairos-primary focus:border-kairos-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="mockup-link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mockup Link (optional)
            </label>
            <input
              type="url"
              id="mockup-link"
              value={mockupLink}
              onChange={(e) => setMockupLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-kairos-primary focus:border-kairos-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kairos-primary"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        <button
          type="button"
          onClick={nextStep}
          disabled={step === 1 && !title || step === 2 && !category || isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kairos-primary ${
            (step === 1 && !title) || (step === 2 && !category) || isSubmitting
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-kairos-primary hover:bg-kairos-button'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : step < 3 ? (
            'Next'
          ) : (
            'Submit Wish'
          )}
        </button>
      </div>
    </div>
  );
}

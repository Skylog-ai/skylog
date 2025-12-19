import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons';

interface InterstitialAdModalProps {
  onClose: () => void;
}

const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({ onClose }) => {
  const [isClosable, setIsClosable] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsClosable(true);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [countdown]);

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interstitial-ad-title"
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all relative animate-slide-up">
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Advertisement
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white bg-black/30 rounded-full p-1 hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          disabled={!isClosable}
          aria-label="Close advertisement"
        >
          {!isClosable ? 
            <span className="text-sm font-bold w-6 h-6 flex items-center justify-center">{countdown}</span> :
            <XMarkIcon className="h-6 w-6" />
          }
        </button>
        
        <div className="p-8 text-center">
          <h2 id="interstitial-ad-title" className="text-2xl font-bold text-slate-800">Your Next Adventure Awaits!</h2>
          <p className="mt-2 text-slate-600">Discover amazing deals on hotels and car rentals for your next trip.</p>
          <div className="mt-6 bg-slate-200 h-64 w-full flex items-center justify-center rounded-md">
            <span className="text-slate-500">Ad Content Placeholder (Image/Video)</span>
          </div>
          <button
            onClick={onClose}
            disabled={!isClosable}
            className="mt-6 w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-wait"
          >
            {isClosable ? 'Continue to App' : `Continue in ${countdown}...`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAdModal;

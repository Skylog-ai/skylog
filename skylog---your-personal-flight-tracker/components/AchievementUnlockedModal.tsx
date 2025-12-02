import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { XMarkIcon, ShareIcon, ClipboardDocumentIcon } from './icons';

interface AchievementUnlockedModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({ achievement, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { icon: Icon } = achievement;

  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleShare = () => {
    const shareText = `I just unlocked the "${achievement.title}" achievement on SkyLog for ${achievement.description.toLowerCase()}! #SkyLog`;
    navigator.clipboard.writeText(shareText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center transform transition-all duration-300 animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-teal-500 shadow-lg">
            <Icon className="w-16 h-16 text-white" aria-label={achievement.title} />
          </div>
          <h2 id="achievement-title" className="text-2xl font-bold text-slate-900">Achievement Unlocked!</h2>
          <p className="mt-2 text-lg font-semibold text-teal-700">{achievement.title}</p>
          <p className="mt-1 text-slate-500">{achievement.description}</p>
        </div>
        <div className="px-6 pb-6 space-y-3">
            <button
                onClick={handleShare}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500"
            >
                {isCopied ? <ClipboardDocumentIcon className="h-5 w-5 mr-2" /> : <ShareIcon className="h-5 w-5 mr-2" />}
                {isCopied ? 'Copied to Clipboard!' : 'Share Achievement'}
            </button>
            <button
                onClick={onClose}
                className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementUnlockedModal;
import React, { useState } from 'react';
import { Stats } from '../types';
import { XMarkIcon, ClipboardDocumentIcon } from './icons';

interface ShareSummaryModalProps {
  stats: Stats;
  onClose: () => void;
}

const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({ stats, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const summaryText = `Check out my travel stats on SkyLog!
✈️ Flights: ${stats.totalFlights}
🌍 Miles Flown: ${stats.totalMiles.toLocaleString()}
🚩 Countries Visited: ${stats.uniqueCountriesCount}

Track your flights and build your own travel summary! #SkyLog #TravelTracker`;
    
    navigator.clipboard.writeText(summaryText).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Share Your Summary</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
            <p className="text-center text-slate-600 mb-4">
                Here's a snapshot of your travels. Copy the text below to share it with your friends!
            </p>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">
                <p>Check out my travel stats on SkyLog!</p>
                <p>✈️ Flights: {stats.totalFlights}</p>
                <p>🌍 Miles Flown: {stats.totalMiles.toLocaleString()}</p>
                <p>🚩 Countries Visited: {stats.uniqueCountriesCount}</p>
                <br />
                <p>Track your flights and build your own travel summary! #SkyLog #TravelTracker</p>
            </div>

            <div className="mt-6">
                <button
                onClick={handleCopyToClipboard}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500"
                >
                <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                {isCopied ? 'Copied to Clipboard!' : 'Copy Summary Text'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSummaryModal;
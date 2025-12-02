import React from 'react';
import { Stats } from '../types';
import { GlobeAltIcon, ChevronRightIcon, ShareIcon } from './icons';

interface ProfileCardProps {
  stats: Stats;
  onViewCountriesClick: () => void;
  onShareClick: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; children?: React.ReactNode }> = ({ title, value, children }) => (
    <div className="bg-slate-50 p-6 rounded-lg h-full">
        <div className="flex items-center">
            {children}
            <div className="ml-4">
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ stats, onViewCountriesClick, onShareClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Travel Summary</h2>
        <button 
          onClick={onShareClick}
          className="flex items-center text-sm font-semibold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-full py-2 px-4 transition-colors"
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Miles Flown" value={stats.totalMiles.toLocaleString()}>
             <GlobeAltIcon className="h-10 w-10 text-teal-600" />
        </StatCard>
        <StatCard title="Total Flights" value={stats.totalFlights}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </StatCard>
        <div 
            onClick={onViewCountriesClick} 
            className="bg-slate-50 p-6 rounded-lg cursor-pointer group transition-all duration-200 hover:bg-teal-50 hover:shadow-md hover:scale-[1.02]"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onViewCountriesClick()}
            aria-label={`View details for ${stats.uniqueCountriesCount} countries visited`}
        >
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="ml-4">
                        <p className="text-sm text-slate-500">Countries Visited</p>
                        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stats.uniqueCountriesCount}</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-slate-400 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
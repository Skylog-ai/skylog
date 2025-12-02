import React from 'react';
import { Stats, Flight, TieredAchievement } from '../types';
import { TIERED_ACHIEVEMENTS } from '../constants';
import { ChevronRightIcon } from './icons';

interface AchievementsSummaryProps {
  stats: Stats;
  flights: Flight[];
  onViewAllClick: () => void;
}

const AchievementSummaryItem: React.FC<{ achievement: TieredAchievement; currentValue: number }> = ({ achievement, currentValue }) => {
    const { id, icon: Icon, title, tiers, formatValue } = achievement;

    const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
    const nextTier = sortedTiers.find(t => currentValue < t.threshold);
    const maxTier = sortedTiers[sortedTiers.length - 1];
    const currentTier = [...tiers].sort((a, b) => b.threshold - a.threshold).find(t => currentValue >= t.threshold);

    const progressPercentage = nextTier ? Math.min(100, (currentValue / nextTier.threshold) * 100) : 100;

    const tierColors = {
      Locked: { bg: 'bg-slate-200', text: 'text-slate-700' },
      Bronze: { bg: 'bg-[#9F7A34]', text: 'text-slate-700' },
      Silver: { bg: 'bg-gray-300', text: 'text-gray-800' },
      Gold: { bg: 'bg-[#D4AF37]', text: 'text-slate-700' },
      Platinum: { bg: 'bg-teal-200', text: 'text-teal-800' },
    };

    const colors = currentTier ? tierColors[currentTier.name] : tierColors.Locked;

    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.bg}`}>
                    <Icon className={`w-7 h-7 ${colors.text} ${id === 'total_flights' ? 'transform -rotate-45' : ''}`} />
                </div>
                <div className="ml-4 flex-grow overflow-hidden">
                    <p className="font-bold text-slate-800 truncate">{title}</p>
                    <p className="text-sm text-slate-500 truncate">{currentTier ? currentTier.title : 'Not yet started'}</p>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>{formatValue(currentValue)}</span>
                    <span>{nextTier ? formatValue(nextTier.threshold) : formatValue(maxTier.threshold)}</span>
                </div>
                <div className="bg-slate-200 rounded-full h-1.5 w-full overflow-hidden">
                    <div
                        className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const AchievementsSummary: React.FC<AchievementsSummaryProps> = ({ stats, flights, onViewAllClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
                <button onClick={onViewAllClick} className="flex items-center text-sm font-semibold text-teal-600 hover:text-teal-800">
                    View All
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                </button>
            </div>
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TIERED_ACHIEVEMENTS.map(ach => {
                        const currentValue = ach.getValue(stats, flights);
                        return <AchievementSummaryItem key={ach.id} achievement={ach} currentValue={currentValue} />
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsSummary;
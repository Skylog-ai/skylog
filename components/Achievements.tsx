import React from 'react';
import { Stats, Flight, TieredAchievement, AchievementTier } from '../types';
import { TIERED_ACHIEVEMENTS } from '../constants';
import { CheckIcon, ArrowLeftIcon } from './icons';

interface AchievementsProps {
  stats: Stats;
  flights: Flight[];
  onBack: () => void;
}

const TierNode: React.FC<{
  tier: AchievementTier;
  currentValue: number;
  nextTier: AchievementTier | null;
  formatValue: (value: number) => string;
  formatUnit: (value: number) => string;
}> = ({ tier, currentValue, nextTier, formatValue, formatUnit }) => {
  const isUnlocked = currentValue >= tier.threshold;
  const isInProgress = nextTier !== null && tier.level === nextTier.level;

  let circleClasses = 'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300';
  if (isUnlocked) {
    circleClasses += ' bg-teal-500 text-white';
  } else if (isInProgress) {
    circleClasses += ' bg-white border-2 border-dashed border-teal-500';
  } else {
    circleClasses += ' bg-slate-200';
  }

  return (
    <div className="flex flex-col items-center text-center w-16 z-10">
      <div className={circleClasses}>
        {isUnlocked && <CheckIcon className="w-6 h-6" />}
      </div>
      <p className="text-sm font-semibold mt-2 text-slate-700">{tier.name}</p>
      <p className="text-xs text-slate-500">
        ({formatValue(tier.threshold)} {formatUnit(tier.threshold)})
      </p>
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: TieredAchievement; currentValue: number }> = ({ achievement, currentValue }) => {
  const { id, icon: Icon, tiers, formatValue, formatUnit, title, description } = achievement;

  const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);

  const nextTier = sortedTiers.find(tier => currentValue < tier.threshold) || null;
  const maxTier = sortedTiers[sortedTiers.length - 1];
  const currentTier = [...tiers]
    .sort((a, b) => b.threshold - a.threshold)
    .find(tier => currentValue >= tier.threshold);

  const progressPercentage = nextTier
    ? Math.min(100, (currentValue / nextTier.threshold) * 100)
    : 100;

  const tierColors = {
    Locked: { bg: 'bg-slate-200', text: 'text-slate-700' },
    Bronze: { bg: 'bg-[#9F7A34]', text: 'text-slate-700' },
    Silver: { bg: 'bg-gray-300', text: 'text-gray-800' },
    Gold: { bg: 'bg-[#D4AF37]', text: 'text-slate-700' },
    Platinum: { bg: 'bg-teal-200', text: 'text-teal-800' },
  };

  const colors = currentTier ? tierColors[currentTier.name] : tierColors.Locked;

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
      {/* Top Section */}
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${colors.bg}`}>
          <Icon className={`w-8 h-8 ${colors.text} ${id === 'total_flights' ? 'transform -rotate-45' : ''}`} aria-label={title} />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="mt-4">
        <div className="flex justify-between text-sm font-medium text-slate-600">
          <span>
            Progress: {formatValue(currentValue)} / {formatValue(nextTier ? nextTier.threshold : maxTier.threshold)}
          </span>
          {nextTier ? <span>Next: {nextTier.name}</span> : <span className="text-teal-600 font-semibold">Max Level!</span>}
        </div>
        <div className="bg-slate-200 rounded-full h-2 mt-1 w-full overflow-hidden">
          <div 
            className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tier Progression Section */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Tier Progression</h4>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200" style={{top: '24px', transform: 'translateY(-50%)'}}></div>
          {sortedTiers.map((tier) => (
            <TierNode
              key={tier.level}
              tier={tier}
              currentValue={currentValue}
              nextTier={nextTier}
              formatValue={formatValue}
              formatUnit={formatUnit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Achievements: React.FC<AchievementsProps> = ({ stats, flights, onBack }) => {
  return (
     <div className="bg-white rounded-lg shadow-lg animate-fade-in">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-800" aria-label="Go back to dashboard">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
            </div>
        </div>
        <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TIERED_ACHIEVEMENTS.map((ach) => {
                const currentValue = ach.getValue(stats, flights);
                return <AchievementCard key={ach.id} achievement={ach} currentValue={currentValue} />;
            })}
            </div>
        </div>
    </div>
  );
};

export default Achievements;
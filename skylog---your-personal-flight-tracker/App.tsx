import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Flight, Achievement, Stats, TieredAchievement, AchievementTier } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import FlightFormModal from './components/FlightFormModal';
import ProfileCard from './components/ProfileCard';
import Achievements from './components/Achievements';
import FlightList from './components/FlightList';
import FlightHistoryPage from './components/FlightHistoryPage';
import CountriesPage from './components/CountriesPage';
import AuthPage from './components/AuthPage';
import { useAuth } from './context/AuthContext';
import { PlusIcon } from './components/icons';
import { AIRPORT_COORDS, TIERED_ACHIEVEMENTS } from './constants';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import ShareSummaryModal from './components/ShareSummaryModal';
import InterstitialAdModal from './components/InterstitialAdModal';
import FooterAd from './components/FooterAd';
import AchievementsSummary from './components/AchievementsSummary';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const [flights, setFlights] = useLocalStorage<Flight[]>(`flights_${currentUser}`, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'history' | 'countries' | 'achievements'>('dashboard');
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const prevUnlockedTiersRef = useRef<Map<string, number>>(new Map());

  const handleAddFlight = (flight: Flight) => {
    setFlights(prevFlights => [...prevFlights, flight].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsModalOpen(false);
    setShowInterstitialAd(true);
  };

  const pastFlights = useMemo(() => {
    const today = new Date();
    return flights.filter(f => new Date(`${f.date}T00:00:00`) <= today);
  }, [flights]);

  const stats: Stats = useMemo(() => {
    const totalMiles = pastFlights.reduce((sum, flight) => sum + flight.distanceMiles, 0);
    const totalFlights = pastFlights.length;
    
    const uniqueCountries = new Set<string>();
    pastFlights.forEach(flight => {
      if (flight.originCountry) uniqueCountries.add(flight.originCountry);
      if (flight.destinationCountry) uniqueCountries.add(flight.destinationCountry);
    });
    
    return {
      totalMiles,
      totalFlights,
      uniqueCountriesCount: uniqueCountries.size,
    };
  }, [pastFlights]);

  useEffect(() => {
    const currentUnlockedTiers = new Map<string, number>();
    let achievementToShow: Achievement | null = null;

    TIERED_ACHIEVEMENTS.forEach(ach => {
      const currentValue = ach.getValue(stats, pastFlights);
      const unlockedTier = [...ach.tiers]
        .sort((a,b) => b.level - a.level)
        .find(tier => currentValue >= tier.threshold);
      
      if (unlockedTier) {
        currentUnlockedTiers.set(ach.id, unlockedTier.level);
        const prevLevel = prevUnlockedTiersRef.current.get(ach.id) || 0;
        if (unlockedTier.level > prevLevel) {
          // This is a new unlock, let's prioritize showing it
          achievementToShow = {
            id: `${ach.id}_${unlockedTier.level}`,
            title: unlockedTier.title,
            description: unlockedTier.description,
            icon: ach.icon
          };
        }
      }
    });

    if (achievementToShow) {
       setNewlyUnlockedAchievement(achievementToShow);
    }

    prevUnlockedTiersRef.current = currentUnlockedTiers;
  }, [stats, pastFlights]);


  if (!currentUser) {
    return <AuthPage />;
  }
  
  const DashboardView = () => (
    <div className="flex flex-col space-y-6">
      {/* Top Row: Profile Stats */}
      <div>
        <ProfileCard 
          stats={stats} 
          onViewCountriesClick={() => setView('countries')} 
          onShareClick={() => setIsShareModalOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flight List */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <FlightList flights={flights} onViewAllClick={() => setView('history')} />
        </div>

        {/* Right Column: Achievements */}
        <div className="lg:col-span-2">
           <AchievementsSummary stats={stats} flights={pastFlights} onViewAllClick={() => setView('achievements')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 selection:bg-teal-500 selection:text-white pb-20">
      <Header onNavigateHome={() => setView('dashboard')} isHome={view === 'dashboard'} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {view === 'dashboard' ? (
          <DashboardView />
        ) : view === 'history' ? (
          <FlightHistoryPage flights={flights} onBack={() => setView('dashboard')} />
        ) : view === 'achievements' ? (
          <Achievements stats={stats} flights={pastFlights} onBack={() => setView('dashboard')} />
        ) : (
          <CountriesPage flights={pastFlights} onBack={() => setView('dashboard')} />
        )}
      </main>

      {view === 'dashboard' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-28 right-6 lg:bottom-28 lg:right-10 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300 z-30"
          aria-label="Add new flight"
        >
          <PlusIcon className="h-8 w-8" />
        </button>
      )}

      {isModalOpen && (
        <FlightFormModal
          onClose={() => setIsModalOpen(false)}
          onAddFlight={handleAddFlight}
        />
      )}

      {newlyUnlockedAchievement && (
        <AchievementUnlockedModal
          achievement={newlyUnlockedAchievement}
          onClose={() => setNewlyUnlockedAchievement(null)}
        />
      )}

      {isShareModalOpen && (
        <ShareSummaryModal
          stats={stats}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {showInterstitialAd && (
        <InterstitialAdModal onClose={() => setShowInterstitialAd(false)} />
      )}

      {currentUser && <FooterAd />}
    </div>
  );
};

export default App;
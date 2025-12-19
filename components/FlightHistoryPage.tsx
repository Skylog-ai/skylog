import React, { useState, useMemo } from 'react';
import { Flight } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon } from './icons';

interface FlightHistoryPageProps {
  flights: Flight[];
  onBack: () => void;
}

const FlightItem: React.FC<{ flight: Flight }> = ({ flight }) => (
  <li className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="bg-teal-100 text-teal-600 rounded-full p-3">
          <PaperAirplaneIcon className="w-6 h-6 transform -rotate-45" />
        </div>
        <div className="ml-4">
          <div className="text-lg font-semibold text-slate-900">
            {flight.origin} → {flight.destination}
          </div>
          <div className="text-sm text-slate-600">
            {`${flight.originCity} → ${flight.destinationCity}`}
          </div>
          <div className="text-sm text-slate-500">
            {new Date(flight.date).toDateString()} | {flight.airline} {flight.flightNumber}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end sm:space-x-8 text-sm">
         <div className="text-center">
            <div className="font-semibold text-slate-800">{flight.distanceMiles.toLocaleString()} mi</div>
            <div className="text-slate-500">Distance</div>
        </div>
         <div className="text-center">
            <div className="font-semibold text-slate-800">{flight.durationHours}h</div>
            <div className="text-slate-500">Duration</div>
        </div>
         <div className="text-center hidden sm:block">
            <div className="font-semibold text-slate-800">{flight.ticketClass}</div>
            <div className="text-slate-500">Class</div>
        </div>
      </div>
    </div>
  </li>
);

const NativeAd: React.FC = () => (
    <li className="p-4 sm:p-6 bg-teal-50/50 hover:bg-teal-50 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-teal-100 text-teal-600 rounded-full p-3">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <div className="text-sm text-teal-700 font-semibold">
              Sponsored
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Plan Your Next Adventure
            </div>
            <div className="text-sm text-slate-600 hidden sm:block">
              Find the best deals on flights and hotels for your dream destination.
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-3 sm:mt-0">
           <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="inline-block bg-teal-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
           >
            Learn More
           </a>
        </div>
      </div>
    </li>
);

const FlightHistoryPage: React.FC<FlightHistoryPageProps> = ({ flights, onBack }) => {
  const [activeTab, setActiveTab] = useState<'past' | 'upcoming'>('past');

  const { pastFlights, upcomingFlights } = useMemo(() => {
    const today = new Date();
    const past = flights
      .filter(f => new Date(`${f.date}T00:00:00`) <= today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const upcoming = flights
      .filter(f => new Date(`${f.date}T00:00:00`) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return { pastFlights: past, upcomingFlights: upcoming };
  }, [flights]);

  const flightsToShow = activeTab === 'past' ? pastFlights : upcomingFlights;
  
  const flightsWithAds = useMemo(() => {
    if (flightsToShow.length < 4) {
        return flightsToShow.map(flight => <FlightItem key={flight.id} flight={flight} />);
    }

    return flightsToShow.flatMap((flight, index) => {
        const flightComponent = <FlightItem key={flight.id} flight={flight} />;
        if ((index + 1) % 5 === 0 && index < flightsToShow.length - 1) {
            return [flightComponent, <NativeAd key={`ad-${index}`} />];
        }
        return [flightComponent];
    });
  }, [flightsToShow]);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-800">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Full Flight History</h2>
        </div>
      </div>
      
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 px-6">
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Past Flights ({pastFlights.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Upcoming Flights ({upcomingFlights.length})
          </button>
        </nav>
      </div>

      {flightsToShow.length > 0 ? (
        <ul className="divide-y divide-slate-200">
          {flightsWithAds}
        </ul>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-slate-900">No {activeTab} flights</h3>
          <p className="mt-2 text-slate-500">There are no flights to display in this category.</p>
        </div>
      )}
    </div>
  );
};

export default FlightHistoryPage;

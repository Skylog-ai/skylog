import React, { useMemo } from 'react';
import { Flight } from '../types';
import { PaperAirplaneIcon, ChevronRightIcon } from './icons';
import { AIRPORT_COORDS } from '../constants';

interface FlightListProps {
  flights: Flight[];
  onViewAllClick: () => void;
}

const FlightList: React.FC<FlightListProps> = ({ flights, onViewAllClick }) => {
  const { pastFlights, upcomingFlights } = useMemo(() => {
    const today = new Date();
    const past = flights
      .filter(f => new Date(`${f.date}T00:00:00`) <= today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    const upcoming = flights
      .filter(f => new Date(`${f.date}T00:00:00`) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    return { pastFlights: past, upcomingFlights: upcoming };
  }, [flights]);

  const FlightPreviewItem: React.FC<{ flight: Flight }> = ({ flight }) => (
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors">
      <div className="flex items-center">
        <div className="bg-slate-200 text-slate-600 rounded-full p-2">
            <PaperAirplaneIcon className="w-5 h-5 transform -rotate-45" />
        </div>
        <div className="ml-3">
          <p className="font-semibold text-slate-800 text-sm">{flight.origin} → {flight.destination}</p>
          <p className="text-xs text-slate-600">{`${flight.originCity} → ${flight.destinationCity}`}</p>
          <p className="text-xs text-slate-500">{new Date(flight.date).toDateString()}</p>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-700">{flight.distanceMiles.toLocaleString()} mi</p>
    </div>
  );

  const hasFlights = flights.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Flight History</h2>
        {hasFlights && (
          <button onClick={onViewAllClick} className="flex items-center text-sm font-semibold text-teal-600 hover:text-teal-800">
            View All
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {!hasFlights ? (
            <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-slate-800">Your Flight Log is Empty</h3>
                <p className="mt-1 text-slate-500 text-sm">Click the '+' button to add your first flight!</p>
            </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Upcoming Trips</h3>
              {upcomingFlights.length > 0 ? (
                <div className="space-y-2">
                  {upcomingFlights.map(f => <FlightPreviewItem key={f.id} flight={f} />)}
                </div>
              ) : <p className="text-sm text-slate-500 italic">No upcoming flights scheduled.</p>}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Flights</h3>
               {pastFlights.length > 0 ? (
                <div className="space-y-2">
                  {pastFlights.map(f => <FlightPreviewItem key={f.id} flight={f} />)}
                </div>
              ) : <p className="text-sm text-slate-500 italic">No past flights logged yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightList;
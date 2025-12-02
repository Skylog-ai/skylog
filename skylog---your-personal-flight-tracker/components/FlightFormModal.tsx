import React, { useState } from 'react';
import { Flight } from '../types';
import { enrichFlightData } from '../services/geminiService';
import { XMarkIcon } from './icons';

interface FlightFormModalProps {
  onClose: () => void;
  onAddFlight: (flight: Flight) => void;
}

const FlightFormModal: React.FC<FlightFormModalProps> = ({ onClose, onAddFlight }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ticketClass, setTicketClass] = useState('Economy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber || !date) {
      setError('Please fill in both flight number and date.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const enrichedData = await enrichFlightData(flightNumber, date);
      const newFlight: Flight = {
        id: new Date().toISOString() + flightNumber,
        flightNumber,
        date,
        ticketClass,
        ...enrichedData,
      };
      onAddFlight(newFlight);
    } catch (err) {
      setError('Could not fetch flight details. Please check the flight number and date.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Log a New Flight</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-medium text-slate-700">Flight Number</label>
              <input
                type="text"
                id="flightNumber"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                placeholder="e.g., UA239"
                className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="ticketClass" className="block text-sm font-medium text-slate-700">Class</label>
              <select
                id="ticketClass"
                value={ticketClass}
                onChange={(e) => setTicketClass(e.target.value)}
                className="mt-1 block w-full bg-slate-100 border border-slate-300 rounded-md shadow-sm py-2 px-3 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enriching Flight Data...
                </>
              ) : 'Log Flight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightFormModal;
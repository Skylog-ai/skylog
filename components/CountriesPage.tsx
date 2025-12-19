import React, { useMemo } from 'react';
import { Flight } from '../types';
import { ArrowLeftIcon } from './icons';
import { AIRPORT_COORDS, COUNTRY_COORDS } from '../constants';

interface CountriesPageProps {
  flights: Flight[];
  onBack: () => void;
}

const CountriesPage: React.FC<CountriesPageProps> = ({ flights, onBack }) => {
    const visitedCountries = useMemo(() => {
        const countrySet = new Set<string>();
        flights.forEach(flight => {
            const originCountry = AIRPORT_COORDS[flight.origin]?.country;
            const destCountry = AIRPORT_COORDS[flight.destination]?.country;
            if (originCountry) countrySet.add(originCountry);
            if (destCountry) countrySet.add(destCountry);
        });
        return Array.from(countrySet).sort();
    }, [flights]);

    return (
        <div className="bg-white rounded-lg shadow-lg animate-fade-in">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-800" aria-label="Go back to dashboard">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900">Countries Visited</h2>
                </div>
            </div>
            
            <div className="p-4 sm:p-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {visitedCountries.length} {visitedCountries.length === 1 ? 'Country' : 'Countries'} Visited
                    </h3>
                    {visitedCountries.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visitedCountries.map(countryName => {
                                const countryData = COUNTRY_COORDS[countryName];
                                if (!countryData) return null;
                                return (
                                    <li key={countryName} className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <img 
                                            src={`https://flagcdn.com/w40/${countryData.code.toLowerCase()}.png`}
                                            width="40"
                                            alt={`${countryData.name} flag`}
                                            className="rounded-md mr-4 shadow-sm"
                                        />
                                        <span className="text-slate-700 font-semibold">{countryData.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-slate-500">No countries logged yet. Add a flight to see your list grow!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountriesPage;
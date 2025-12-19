import React from 'react';

export interface Flight {
  id: string;
  flightNumber: string;
  date: string;
  ticketClass: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  originCountry: string;
  destinationCountry: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: number;
  distanceMiles: number;
  airline: string;
}

export interface Stats {
  totalMiles: number;
  totalFlights: number;
  uniqueCountriesCount: number;
}

export interface AirportCoords {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface AchievementTier {
  level: number;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  title: string;
  description: string;
  threshold: number;
}

export interface TieredAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  tiers: AchievementTier[];
  getValue: (stats: Stats, flights: Flight[]) => number;
  formatValue: (value: number) => string;
  formatUnit: (value: number) => string;
}

// Kept for the modal, which needs a simple object
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
}
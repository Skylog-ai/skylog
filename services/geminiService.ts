import { GoogleGenAI, Type } from "@google/genai";
import { Flight } from '../types';

// FIX: Initialize GoogleGenAI with process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flightSchema = {
  type: Type.OBJECT,
  properties: {
    origin: { type: Type.STRING, description: 'Origin airport IATA code (e.g., JFK)' },
    destination: { type: Type.STRING, description: 'Destination airport IATA code (e.g., LAX)' },
    originCity: { type: Type.STRING, description: 'City name of the origin airport (e.g., "New York")' },
    destinationCity: { type: Type.STRING, description: 'City name of the destination airport (e.g., "Los Angeles")' },
    originCountry: { type: Type.STRING, description: 'Country name of the origin airport (e.g., "USA")' },
    destinationCountry: { type: Type.STRING, description: 'Country name of the destination airport (e.g., "USA")' },
    departureTime: { type: Type.STRING, description: 'Departure time in HH:MM format (local time)' },
    arrivalTime: { type: Type.STRING, description: 'Arrival time in HH:MM format (local time)' },
    durationHours: { type: Type.NUMBER, description: 'Flight duration in hours as a decimal (e.g., 5.5)' },
    distanceMiles: { type: Type.NUMBER, description: 'Flight distance in miles' },
    airline: { type: Type.STRING, description: 'Name of the airline (e.g., "Delta Air Lines")' }
  },
  required: ['origin', 'destination', 'originCity', 'destinationCity', 'originCountry', 'destinationCountry', 'departureTime', 'arrivalTime', 'durationHours', 'distanceMiles', 'airline']
};

export const enrichFlightData = async (
  flightNumber: string,
  date: string,
): Promise<Omit<Flight, 'id' | 'flightNumber' | 'date' | 'ticketClass'>> => {
  try {
    const prompt = `
      Based on the flight number ${flightNumber} scheduled for the date ${date}, provide the following flight details including city and country names.
      If the exact flight isn't found, provide details for a typical flight on that route for that airline.
      The output must be in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flightSchema,
      },
    });

    const text = response.text.trim();
    const flightData = JSON.parse(text);

    // Basic validation
    if (
        typeof flightData.origin !== 'string' ||
        typeof flightData.destination !== 'string' ||
        typeof flightData.originCity !== 'string' ||
        typeof flightData.destinationCity !== 'string' ||
        typeof flightData.distanceMiles !== 'number'
    ) {
        throw new Error("Invalid data structure received from API");
    }

    return flightData;

  } catch (error) {
    console.error("Error fetching flight data from Gemini API:", error);
    // Provide fallback data in case of an error to not break the user flow
    return {
        origin: "N/A",
        destination: "N/A",
        originCity: "Unknown",
        destinationCity: "Unknown",
        originCountry: "Unknown",
        destinationCountry: "Unknown",
        departureTime: "00:00",
        arrivalTime: "00:00",
        durationHours: 0,
        distanceMiles: 0,
        airline: "Unknown Airline"
    };
  }
};
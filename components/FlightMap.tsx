import React, { useMemo } from 'react';
import { Flight } from '../types';
import { AIRPORT_COORDS, COUNTRY_COORDS } from '../constants';

// A correct, simplified, and standard SVG path for the world map.
const WORLD_PATH_DATA = "M844.2,267.3L843,266.1l-1.3,1.3l-0.3,1.6l1.1,1.6l2.4-0.2l1.1-1L844.2,267.3z M812.5,248.1l-1.7,0.4l-0.6,1.6 l0.4,1.6l1.6,0.6l1.7-1.4l-0.4-1.8L812.5,248.1z M784.1,247.3l-2.6,0.2l-1.2,1.6l0.3,1.8l1.5,1l1.7-1l1.6-2L784.1,247.3z M772.8,236.5l-1.7,1.4l-0.4,1.8l0.9,1.4l2.1-0.4l0.9-1.7l-0.7-1.8L772.8,236.5z M762.6,233.7l-2.2,0.6l-0.7,2.3 l1.8,1.7l2.1-1l0.5-2.3L762.6,233.7z M758.1,225.2L756,226.4l0,2.1l1.5,1l1.9-1.2l0-2.1L758.1,225.2z M744.5,220.9l-2.4,0.8 l-0.9,2.3l1.9,1.4l2.3-1l0.4-2.1L744.5,220.9z M730.3,214.6l-2.4,0.8l-0.9,2.3l1.7,1.4l1.9-1l0.9-1.8L730.3,214.6z M724,209.2 l-1.9,1.4l-0.2,2.3l1.4,1.2l1.9-1.2l0.4-2.3L724,209.2z M701.2,197.1l-1.7,1l-0.2,2.1l1.5,1l1.9-1l0.2-2.1L701.2,197.1z M689.9,191.6l-1.7,1.2l0,2.3l1.7,0.9l1.7-1.2l-0.2-2.3L689.9,191.6z M672.6,185.9l-1.7,1l-0.2,2.1l1.5,0.8l1.9-1 l0.2-2.1L672.6,185.9z M662.9,179.1l-1.6,1l-0.4,1.9l1.4,1l1.9-0.8l0-2.1L662.9,179.1z M652.2,173.6l-1.6,1l0.3,2.1l1.8,0.6 l1.6-1.2l-0.4-2.1L652.2,173.6z M624.1,153.9l-1.7,0.8l0.2,2.1l1.6,0.6l1.6-1.2l-0.4-2.1L624.1,153.9z M589.6,135.5l-2.1,1.2 l0.1,2.3l1.8,0.8l1.7-1.2l-0.4-2.3L589.6,135.5z M553.7,115.1l-1.8,1l0.1,2.1l1.7,0.8l1.5-1l-0.2-2.1L553.7,115.1z M535.4,104.9 l-1.9,1l0.1,2.1l1.6,0.8l1.7-1l0-2.1L535.4,104.9z M499.9,82.4L498,83.5l0.1,2.1l1.6,0.8l1.7-1l-0.1-2.1L499.9,82.4z M361.3,90.1 l-1.9,1.2l0.3,2.3l1.7,0.6l1.6-1l-0.4-2.3L361.3,90.1z M307.7,114.9l-1.9,1.2l0.2,2.1l1.7,0.8l1.5-1l-0.2-2.1L307.7,114.9z M279.6,131.3l-2,1.2l0.2,2.1l1.7,0.8l1.6-1.2l-0.2-2.1L279.6,131.3z M248.5,150.1l-1.8,1l0.1,2.1l1.6,0.8l1.7-1 l-0.1-2.1L248.5,150.1z M238.2,160.7l-1.8,1l0,2.1l1.6,0.8l1.7-1l-0.2-2.1L238.2,160.7z M210.3,180l-1.8,1l0.1,2.1l1.6,0.8 l1.7-1l-0.2-2.1L210.3,180z M194.9,191.6l-1.7,1l-0.3,2.1l1.6,0.8l1.6-1l-0.3-2.1L194.9,191.6z M177.6,204.1l-1.7,1l0,2.1 l1.6,0.8l1.7-1l-0.2-2.1L177.6,204.1z M152.4,221.5l-1.8,1l0.1,2.1l1.6,0.8l1.7-1l-0.2-2.1L152.4,221.5z M238.6,256.4 l-1.7,1l0,2.1l1.5,0.8l1.7-1l0-2.1L238.6,256.4z M265,281.3l-1.7,1l-0.1,2.1l1.6,0.8l1.7-1l-0.1-2.1L265,281.3z M308.2,314.2l-1.7,1l0.2,2.1l1.6,0.8l1.6-1l-0.3-2.1L308.2,314.2z M332.7,330l-1.7,1l0,2.1l1.6,0.8l1.7-1 l-0.2-2.1L332.7,330z M343,341.9l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L343,341.9z M350.2,350.8l-1.7,1l0,2.1l1.5,0.8 l1.7-1l-0.2-2.1L350.2,350.8z M354.1,358.5l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L354.1,358.5z M355.1,367.4l-1.7,1 l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L355.1,367.4z M354.4,377.7l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L354.4,377.7z M351,386.6l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L351,386.6z M345.4,398.4l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1 L345.4,398.4z M338.5,411.3l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L338.5,411.3z M329.8,425.9l-1.7,1l0,2.1l1.5,0.8 l1.7-1l-0.2-2.1L329.8,425.9z M318,440.9l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L318,440.9z M303.4,455.5l-1.7,1 l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L303.4,455.5z M286.2,469l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L286.2,469z M266.4,482.3l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L266.4,482.3z M487,273.1l-1.8,1l0.1,2.1l1.6,0.8l1.7-1l-0.2-2.1 L487,273.1z M517.1,277l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L517.1,277z M551.7,292.1l-1.7,1l0,2.1l1.5,0.8l1.7-1 l-0.2-2.1L551.7,292.1z M590.2,311.6l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L590.2,311.6z M628.6,322.8l-1.7,1l0,2.1 l1.5,0.8l1.7-1l-0.2-2.1L628.6,322.8z M663,330l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L663,330z M713.4,330.6 l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L713.4,330.6z M747,321.6l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L747,321.6z M789.5,304.5l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L789.5,304.5z M820.2,290.1l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1 L820.2,290.1z M844,280l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L844,280z M868.2,279.9l-1.7,1l0,2.1l1.5,0.8l1.7-1 l-0.2-2.1L868.2,279.9z M905.3,263.4l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L905.3,263.4z M926.2,256l-1.7,1l0,2.1 l1.5,0.8l1.7-1l-0.2-2.1L926.2,256z M935.5,251.9l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L935.5,251.9z M954.5,248.1 l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L954.5,248.1z M964.9,245.9l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L964.9,245.9z M971.9,243.8l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L971.9,243.8z M976.5,241.1l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1 L976.5,241.1z M988.4,235.1l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L988.4,235.1z M993.4,232.5l-1.7,1l0,2.1l1.5,0.8 l1.7-1l-0.2-2.1L993.4,232.5z M996.9,229.8l-1.7,1l0,2.1l1.5,0.8l1.7-1l-0.2-2.1L996.9,229.8z";

const MapPin = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path
      d="M12 21.7C12 21.7 4 13.7 4 8a8 8 0 1 1 16 0c0 5.7-8 13.7-8 13.7z"
      transform="translate(-12, -23) scale(1.2)"
      className="fill-teal-500/80 stroke-white/50"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
    />
    <circle
      cx="0"
      cy="-7.5"
      r="3.5"
      className="fill-white"
      vectorEffect="non-scaling-stroke"
    />
  </g>
);


interface FlightMapProps {
  flights: Flight[];
}

const FlightMap: React.FC<FlightMapProps> = ({ flights }) => {
  const WIDTH = 1000;
  const HEIGHT = 500;

  const lonLatToXY = (lon: number, lat: number) => {
    const x = (lon + 180) * (WIDTH / 360);
    const y = (90 - lat) * (HEIGHT / 180);
    return { x, y };
  };

  const visitedCountries = useMemo(() => {
    const countrySet = new Set<string>();
    flights.forEach(flight => {
      const originCountry = AIRPORT_COORDS[flight.origin]?.country;
      const destCountry = AIRPORT_COORDS[flight.destination]?.country;
      if (originCountry) countrySet.add(originCountry);
      if (destCountry) countrySet.add(destCountry);
    });
    return Array.from(countrySet);
  }, [flights]);

  return (
    <svg
      className="w-full h-full"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <path
          d={WORLD_PATH_DATA}
          className="fill-white stroke-slate-900"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Country Pins */}
        {visitedCountries.map((countryName) => {
          const countryData = COUNTRY_COORDS[countryName];
          if (!countryData) return null;

          const { x, y } = lonLatToXY(countryData.lon, countryData.lat);
          
          return (
             <g key={countryName} className="group cursor-pointer">
                <MapPin x={x} y={y} />
                <title>{countryData.name}</title>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default FlightMap;

import React from 'react';
import { ParkingSpot, SpotStatus, VehicleType } from '../types';
import { Car, Zap, Accessibility, Armchair } from 'lucide-react';

interface ParkingMapProps {
  spots: ParkingSpot[];
  onSpotClick: (spot: ParkingSpot) => void;
}

const ParkingMap: React.FC<ParkingMapProps> = ({ spots, onSpotClick }) => {
  
  const getStatusColor = (status: SpotStatus) => {
    switch (status) {
      case SpotStatus.AVAILABLE: return 'bg-emerald-100 border-emerald-400 hover:bg-emerald-200 text-emerald-700';
      case SpotStatus.OCCUPIED: return 'bg-rose-100 border-rose-400 text-rose-700 opacity-80';
      case SpotStatus.RESERVED: return 'bg-amber-100 border-amber-400 text-amber-700';
      case SpotStatus.MAINTENANCE: return 'bg-slate-200 border-slate-400 text-slate-500 cursor-not-allowed';
      default: return 'bg-gray-100';
    }
  };

  const getIcon = (type: VehicleType) => {
    switch (type) {
      case VehicleType.EV: return <Zap size={14} className="mb-1" />;
      case VehicleType.HANDICAP: return <Accessibility size={14} className="mb-1" />;
      case VehicleType.SUV: return <Car size={16} className="mb-1" />;
      default: return <Car size={14} className="mb-1" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
        Live Parking View
      </h3>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {spots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => onSpotClick(spot)}
            disabled={spot.status === SpotStatus.OCCUPIED || spot.status === SpotStatus.MAINTENANCE}
            className={`
              relative p-2 h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200
              ${getStatusColor(spot.status)}
            `}
          >
            {getIcon(spot.type)}
            <span className="text-xs font-bold">{spot.section}-{spot.id}</span>
            <span className="text-[10px] uppercase mt-1">{spot.status === SpotStatus.AVAILABLE ? 'Free' : spot.status}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-4 text-sm text-slate-600 justify-center flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-100 border border-emerald-400 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-100 border border-rose-400 rounded"></div> Occupied</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-100 border border-amber-400 rounded"></div> Reserved</div>
      </div>
    </div>
  );
};

export default ParkingMap;

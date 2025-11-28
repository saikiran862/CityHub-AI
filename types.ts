export enum SpotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum VehicleType {
  COMPACT = 'COMPACT',
  SUV = 'SUV',
  HANDICAP = 'HANDICAP',
  EV = 'EV'
}

export interface ParkingSpot {
  id: string;
  section: string;
  status: SpotStatus;
  type: VehicleType;
  lastUpdated: Date;
}

export interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  occupancyRate: number;
  revenue: number;
  peakHours: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  username: string;
  role: 'user' | 'admin';
}

export interface Movie {
  id: string;
  title: string;
  language: string;
  poster: string;
  rating: number;
  showtimes: string[];
}

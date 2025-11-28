import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Car, Map, Settings, Menu, Bell, Film, LogOut } from 'lucide-react';
import ParkingMap from './components/ParkingMap';
import DriverChat from './components/DriverChat';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import MovieBooking from './components/MovieBooking';
import Logo from './components/Logo';
import Payment from './components/Payment';
import { ParkingSpot, SpotStatus, VehicleType, ParkingStats, User } from './types';

// Mock Data Generators
const generateSpots = (count: number): ParkingSpot[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString().padStart(3, '0'),
    section: i < 16 ? 'A' : 'B',
    status: Math.random() > 0.6 ? SpotStatus.OCCUPIED : SpotStatus.AVAILABLE,
    type: i % 10 === 0 ? VehicleType.HANDICAP : i % 8 === 0 ? VehicleType.EV : Math.random() > 0.7 ? VehicleType.SUV : VehicleType.COMPACT,
    lastUpdated: new Date()
  }));
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'DRIVER' | 'MANAGER' | 'MOVIES'>('DRIVER');
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [stats, setStats] = useState<ParkingStats>({
    totalSpots: 0,
    availableSpots: 0,
    occupiedSpots: 0,
    occupancyRate: 0,
    revenue: 0,
    peakHours: '12:00 - 14:00'
  });

  // Hooks must be called before conditional returns
  useEffect(() => {
    const initialSpots = generateSpots(48);
    setSpots(initialSpots);

    const interval = setInterval(() => {
      setSpots(current => {
        const newSpots = [...current];
        const indexToChange = Math.floor(Math.random() * newSpots.length);
        const spot = newSpots[indexToChange];
        
        // Don't change status of currently selected spot to prevent UI glitches
        if (bookingSpot && spot.id === bookingSpot.id) return newSpots;

        if (Math.random() > 0.5) {
          spot.status = spot.status === SpotStatus.AVAILABLE ? SpotStatus.OCCUPIED : SpotStatus.AVAILABLE;
          spot.lastUpdated = new Date();
        }
        return newSpots;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingSpot]);

  useEffect(() => {
    const total = spots.length;
    const available = spots.filter(s => s.status === SpotStatus.AVAILABLE).length;
    const occupied = total - available;
    
    setStats({
      totalSpots: total,
      availableSpots: available,
      occupiedSpots: occupied,
      occupancyRate: total > 0 ? occupied / total : 0,
      revenue: occupied * 5.50 + 1240, 
      peakHours: '12:00 - 14:00'
    });
  }, [spots]);

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === SpotStatus.AVAILABLE) {
      setBookingSpot(spot);
    }
  };

  const calculateParkingPrice = (type: VehicleType): number => {
    if (type === VehicleType.SUV || type === VehicleType.HANDICAP) {
      return 100; // Cars
    }
    return 50; // Bikes (Compact/EV)
  };

  const handleBookingSuccess = () => {
    if (bookingSpot) {
      alert(`Parking Slot ${bookingSpot.section}-${bookingSpot.id} Booked Successfully!`);
      // Update local state to show reserved immediately
      setSpots(prev => prev.map(s => s.id === bookingSpot.id ? {...s, status: SpotStatus.RESERVED} : s));
    }
    setBookingSpot(null);
  };

  // Handle Authentication
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <Logo size="sm" />
            <h1 className="font-bold text-xl tracking-tight">CityHub AI</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setViewMode('DRIVER')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'DRIVER' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Car size={18} />
            <span>Find & Book Parking</span>
          </button>
          
          <button 
            onClick={() => setViewMode('MOVIES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'MOVIES' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Film size={18} />
            <span>Movies</span>
          </button>

          {user.role === 'admin' && (
            <button 
              onClick={() => setViewMode('MANAGER')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'MANAGER' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <LayoutDashboard size={18} />
              <span>City Admin</span>
            </button>
          )}

          <div className="pt-8 px-4">
             <p className="text-xs uppercase text-slate-500 font-semibold mb-2">System Status</p>
             <div className="flex items-center gap-2 text-sm text-emerald-400">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Online & Monitoring
             </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {viewMode === 'DRIVER' && 'Parking Dashboard'}
            {viewMode === 'MANAGER' && 'City Operations'}
            {viewMode === 'MOVIES' && 'Movie Ticket Booking'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Hi, {user.username}</span>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-full flex items-center justify-center font-bold text-xs">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            {viewMode === 'DRIVER' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-sm text-slate-500">Available Spots</p>
                      <p className="text-2xl font-bold text-emerald-600">{stats.availableSpots}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Standard Rate (Car)</p>
                      <p className="text-2xl font-bold text-slate-800">₹100</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bike Rate</p>
                      <p className="text-2xl font-bold text-slate-800">₹50</p>
                    </div>
                  </div>
                  <ParkingMap 
                    spots={spots} 
                    onSpotClick={handleSpotClick} 
                  />
                  <p className="text-sm text-slate-500 mt-2 text-center">Click on a green spot to book</p>
                </div>
                <div className="lg:col-span-1">
                  <DriverChat spots={spots} />
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">CityHub Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                      <li>Reserve spots in advance</li>
                      <li>Contactless UPI payments</li>
                      <li>Movie ticket discounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'MANAGER' && <Dashboard stats={stats} spots={spots} />}
            
            {viewMode === 'MOVIES' && <MovieBooking />}

          </div>
        </div>

        {/* Parking Booking Payment Modal */}
        {bookingSpot && (
          <Payment 
            amount={calculateParkingPrice(bookingSpot.type)} 
            onSuccess={handleBookingSuccess} 
            onCancel={() => setBookingSpot(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
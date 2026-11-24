import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Star, Fuel, Users, Zap, X,
  Filter, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { getUsers } from '../../services/store';
import type { Vehicle, VehicleCategory, RentalMode, Booking } from '../../types';

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function matchesLocation(vehicle: Vehicle, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const area = vehicle.area || '';
  const city = vehicle.city || '';
  const pickup = vehicle.pickupAddress || '';
  const state = vehicle.state || '';
  const loc = vehicle.location || '';
  return (
    area.toLowerCase().includes(q) ||
    city.toLowerCase().includes(q) ||
    pickup.toLowerCase().includes(q) ||
    state.toLowerCase().includes(q) ||
    loc.toLowerCase().includes(q)
  );
}

interface SearchState {
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

function getDurationHours(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 36e5 * 10) / 10;
}

export default function RenterSearchPage() {
  const { vehicles, refreshVehicles, createBooking } = useApp();
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    refreshVehicles();
    const handleUpdate = () => refreshVehicles();
    window.addEventListener('vaygo:vehicles', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vaygo:vehicles', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshVehicles]);

  const now = new Date();
  const startDefault = new Date(now.getTime() + 60 * 60000);
  const endDefault = new Date(startDefault.getTime() + 4 * 36e5);

  const [search, setSearch] = useState<SearchState>({
    location: '',
    startDate: startDefault.toISOString().split('T')[0],
    startTime: `${pad(startDefault.getHours())}:00`,
    endDate: endDefault.toISOString().split('T')[0],
    endTime: `${pad(endDefault.getHours())}:00`,
  });
  const [searched, setSearched] = useState(true);
  const [searchError, setSearchError] = useState('');

  const [filterCat, setFilterCat] = useState<VehicleCategory | 'all'>('all');
  const [filterMode, setFilterMode] = useState<RentalMode | 'any'>('any');
  const [filterSort, setFilterSort] = useState<'price_asc' | 'price_desc' | 'rating_desc'>('rating_desc');
  const [filterMax, setFilterMax] = useState<number>(2000);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedMode, setSelectedMode] = useState<RentalMode>('self-drive');
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const vid = params.get('vehicleId');
    if (vid) {
      const v = vehicles.find(x => x.id === vid);
      if (v) { setSelectedVehicle(v); setSelectedMode(v.rentalModes[0]); }
    }
  }, [params, vehicles]);

  const { startDT, endDT, durationHours, durationError } = useMemo(() => {
    const s = new Date(`${search.startDate}T${search.startTime}`);
    const e = new Date(`${search.endDate}T${search.endTime}`);
    const dh = getDurationHours(s, e);
    let error = '';
    if (s <= now) error = 'Start time must be in the future.';
    else if (e <= s) error = 'End time must be after start time.';
    else if (dh < 1) error = 'Minimum rental duration is 1 hour.';
    return { startDT: s, endDT: e, durationHours: dh, durationError: error };
  }, [search]);

  const totalAmount = selectedVehicle ? Math.round(selectedVehicle.pricePerHour * durationHours) : 0;

  const results = useMemo(() => {
    if (!searched) return [];
    let list = vehicles.filter(v => v.isActive !== false && matchesLocation(v, search.location));
    if (filterCat !== 'all') list = list.filter(v => v.category === filterCat);
    if (filterMode !== 'any') list = list.filter(v => v.rentalModes.includes(filterMode));
    list = list.filter(v => v.pricePerHour <= filterMax);
    if (filterSort === 'price_asc') list = [...list].sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (filterSort === 'price_desc') list = [...list].sort((a, b) => b.pricePerHour - a.pricePerHour);
    else list = [...list].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  }, [searched, vehicles, search.location, filterCat, filterMode, filterSort, filterMax]);

  const handleSearch = () => {
    if (durationError) { setSearchError(durationError); return; }
    setSearchError('');
    setSearched(true);
  };

  const handleBook = async () => {
    if (!currentUser || !selectedVehicle) return;
    if (durationError) { setBookingError(durationError); return; }
    const minHours = selectedVehicle.minRentalHours ?? 1;
    if (durationHours < minHours) {
      setBookingError(`Minimum rental for this vehicle is ${minHours} hours.`);
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      const allUsers = getUsers();
      const raviUser = allUsers.find(u => u.email && u.email.trim().toLowerCase() === 'ravi@gmail.com');
      let targetHostId = selectedVehicle.hostId || selectedVehicle.ownerId;
      if (selectedVehicle.id.startsWith('v_ravi_') && raviUser) {
        targetHostId = raviUser.id;
      }
      if (!targetHostId) {
        targetHostId = 'u_host_ravi';
      }

      const b = createBooking({
        vehicleId: selectedVehicle.id,
        hostId: targetHostId,
        renterId: currentUser.id,
        rentalMode: selectedMode,
        startDateTime: startDT.toISOString(),
        endDateTime: endDT.toISOString(),
        durationHours,
        totalAmount,
        pickupLocation: `${selectedVehicle.pickupAddress || selectedVehicle.location || selectedVehicle.city}`,
      });
      setBookingSuccess(b);
    } catch {
      setBookingError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setBookingSuccess(null);
    setBookingError('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-black text-white mb-5 tracking-tight">Find Your Ride</h1>

          <div className="glass-panel rounded-2xl p-5 border border-white/15">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2 relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                <input
                  type="text"
                  placeholder="Koramangala, Bengaluru…"
                  value={search.location}
                  onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
                  className="w-full h-11 pl-9 pr-9 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                />
                {search.location && (
                  <button onClick={() => setSearch(s => ({ ...s, location: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white cursor-pointer">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input type="date" value={search.startDate} min={now.toISOString().split('T')[0]}
                  onChange={e => setSearch(s => ({ ...s, startDate: e.target.value }))}
                  className="flex-1 h-11 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs focus:outline-none focus:border-white/40 transition-all" />
                <input type="time" value={search.startTime}
                  onChange={e => setSearch(s => ({ ...s, startTime: e.target.value }))}
                  className="w-24 h-11 px-2 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs focus:outline-none focus:border-white/40 transition-all" />
              </div>

              <div className="flex gap-2">
                <input type="date" value={search.endDate} min={search.startDate}
                  onChange={e => setSearch(s => ({ ...s, endDate: e.target.value }))}
                  className="flex-1 h-11 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs focus:outline-none focus:border-white/40 transition-all" />
                <input type="time" value={search.endTime}
                  onChange={e => setSearch(s => ({ ...s, endTime: e.target.value }))}
                  className="w-24 h-11 px-2 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs focus:outline-none focus:border-white/40 transition-all" />
              </div>

              <button onClick={handleSearch}
                className="h-11 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer">
                <Search size={16} />Search
              </button>
            </div>

            {!durationError && durationHours > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#A1A1AA]">
                <Clock size={13} />
                <span>Duration: <span className="text-white font-semibold">{durationHours} hours</span></span>
              </div>
            )}
            {(searchError || durationError) && (
              <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1"><XCircle size={13} />{searchError || durationError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {searched && (
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-sm font-bold text-white">{results.length} vehicle{results.length !== 1 ? 's' : ''} found</span>
              <div className="flex items-center gap-2 flex-wrap ml-auto">
                {(['all', 'bike', 'car', 'auto'] as const).map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${filterCat === c ? 'bg-white text-black border-white' : 'border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40'}`}>
                    {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
                <button onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40 cursor-pointer transition-all">
                  <Filter size={12} />More Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="glass-card rounded-2xl p-4 mb-5 border border-white/15 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Rental Mode</label>
                  <select value={filterMode} onChange={e => setFilterMode(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg border border-white/15 bg-[#111] text-white text-xs focus:outline-none">
                    <option value="any">Any</option>
                    <option value="self-drive">Self Drive</option>
                    <option value="with-driver">With Driver</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Sort By</label>
                  <select value={filterSort} onChange={e => setFilterSort(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg border border-white/15 bg-[#111] text-white text-xs focus:outline-none">
                    <option value="rating_desc">Top Rated</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Max Price: ₹{filterMax}/hr</label>
                  <input type="range" min={50} max={2000} step={50} value={filterMax} onChange={e => setFilterMax(Number(e.target.value))}
                    className="w-full accent-white" />
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
                <p className="text-[#A1A1AA] text-sm mb-2">No vehicles found for your search.</p>
                <p className="text-[#A1A1AA] text-xs">Try a different location or adjust your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((v) => (
                  <div key={v.id}
                    className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all group border border-white/10 hover:border-white/25"
                    onClick={() => { setSelectedVehicle(v); setSelectedMode(v.rentalModes[0]); setBookingSuccess(null); setBookingError(''); }}>
                    <div className="relative h-44 bg-[#0A0A0A]">
                      <img
                        src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'}
                        alt={v.model}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/15">{v.category}</span>
                      </div>
                      {(v.rating ?? 0) > 0 && (
                        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/15">
                          <Star size={11} className="fill-white stroke-none" />
                          <span className="text-xs font-bold text-white">{v.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-extrabold text-white text-sm truncate">{v.brand} {v.model} ({v.year})</h3>
                      <div className="flex items-center gap-1 text-[#A1A1AA] text-xs mt-1 mb-3">
                        <MapPin size={11} /><span className="truncate">{v.area || v.location}, {v.city}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="flex items-center gap-1 text-[#A1A1AA] text-xs bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                          <Fuel size={11} />{v.specs?.fuelType || v.fuelType || 'Petrol'}
                        </span>
                        <span className="flex items-center gap-1 text-[#A1A1AA] text-xs bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                          <Users size={11} />{v.specs?.seats || v.seats || 2} seats
                        </span>
                        {(v.specs?.transmission || v.transmission) && (
                          <span className="flex items-center gap-1 text-[#A1A1AA] text-xs bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                            <Zap size={11} />{v.specs?.transmission || v.transmission}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-white font-black text-lg">₹{v.pricePerHour}</span>
                          <span className="text-[#A1A1AA] text-xs">/hr</span>
                          {!durationError && durationHours > 0 && (
                            <div className="text-[#A1A1AA] text-[10px]">≈ ₹{Math.round(v.pricePerHour * durationHours).toLocaleString('en-IN')} total</div>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-white px-3 py-1 rounded-xl glass-card border border-white/20 hover:bg-white hover:text-black transition-all">
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mx-auto mb-5">
              <Search size={28} className="text-white/60" />
            </div>
            <h3 className="text-white font-black text-xl mb-2">Enter your details to search</h3>
            <p className="text-[#A1A1AA] text-sm max-w-sm mx-auto">
              Enter a location and choose your rental dates and times, then hit Search.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedVehicle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl glass-panel rounded-3xl border border-white/20 overflow-y-auto max-h-[90vh]">
              <div className="relative h-56 bg-[#0A0A0A]">
                <img src={selectedVehicle.images[0]} alt={selectedVehicle.model} className="w-full h-full object-cover" />
                <button onClick={closeModal}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 cursor-pointer">
                  <X size={16} />
                </button>
                {(selectedVehicle.rating ?? 0) > 0 && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Star size={13} className="fill-white stroke-none" />
                    <span className="text-sm font-bold text-white">{selectedVehicle.rating}</span>
                    <span className="text-xs text-[#A1A1AA]">({selectedVehicle.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {bookingSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle2 size={48} className="text-white mx-auto mb-4" />
                    <h2 className="text-xl font-black text-white mb-2">Booking Requested!</h2>
                    <p className="text-[#A1A1AA] text-sm mb-4">Your request has been sent to the host.</p>
                    <div className="glass-card rounded-2xl p-4 border border-white/15 text-left mb-5">
                      <div className="text-xs text-[#A1A1AA] mb-1">Reference Number</div>
                      <div className="font-black text-white text-lg">{bookingSuccess.referenceNumber}</div>
                      <div className="text-xs text-[#A1A1AA] mt-2">Status: <span className="text-white font-bold capitalize">{bookingSuccess.status}</span></div>
                      <div className="text-xs text-[#A1A1AA] mt-1">Total: <span className="text-white font-bold">₹{bookingSuccess.totalAmount.toLocaleString('en-IN')}</span></div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { closeModal(); navigate('/renter/bookings'); }}
                        className="flex-1 py-3 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-neutral-200 cursor-pointer">
                        View My Bookings
                      </button>
                      <button onClick={closeModal}
                        className="flex-1 py-3 rounded-xl glass-card border border-white/20 text-white font-semibold text-sm hover:bg-white/10 cursor-pointer">
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-xl font-black text-white">{selectedVehicle.brand} {selectedVehicle.model}</h2>
                        <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs mt-1">
                          <MapPin size={12} />
                          <span>{selectedVehicle.pickupAddress || selectedVehicle.location || selectedVehicle.area}, {selectedVehicle.city}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white font-black text-2xl">₹{selectedVehicle.pricePerHour}</div>
                        <div className="text-[#A1A1AA] text-xs">/hour</div>
                      </div>
                    </div>

                    <p className="text-[#A1A1AA] text-sm mb-5">{selectedVehicle.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: 'Fuel', value: selectedVehicle.specs?.fuelType || selectedVehicle.fuelType || 'Petrol' },
                        { label: 'Seats', value: `${selectedVehicle.specs?.seats || selectedVehicle.seats || 2}` },
                        ...((selectedVehicle.specs?.transmission || selectedVehicle.transmission) ? [{ label: 'Transmission', value: selectedVehicle.specs?.transmission || selectedVehicle.transmission }] : []),
                        ...(selectedVehicle.specs?.engineCC ? [{ label: 'Engine', value: `${selectedVehicle.specs.engineCC}cc` }] : []),
                        ...(selectedVehicle.specs?.hasAC !== undefined ? [{ label: 'AC', value: selectedVehicle.specs.hasAC ? 'Yes' : 'No' }] : []),
                      ].map(spec => (
                        <div key={spec.label} className="glass-card rounded-xl p-3 border border-white/10">
                          <div className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">{spec.label}</div>
                          <div className="text-white text-sm font-bold mt-0.5">{spec.value}</div>
                        </div>
                      ))}
                    </div>

                    {selectedVehicle.rentalModes.length > 1 && (
                      <div className="mb-5">
                        <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-2">Rental Mode</label>
                        <div className="flex gap-3">
                          {selectedVehicle.rentalModes.map(m => (
                            <button key={m} onClick={() => setSelectedMode(m)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedMode === m ? 'bg-white text-black border-white' : 'border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40'}`}>
                              {m === 'self-drive' ? 'Self Drive' : 'With Driver'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="glass-card rounded-2xl p-4 border border-white/15 mb-5">
                      <h3 className="text-sm font-black text-white mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#A1A1AA]">Pickup</span>
                          <span className="text-white font-semibold">{formatDateTime(startDT.toISOString())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A1A1AA]">Return</span>
                          <span className="text-white font-semibold">{formatDateTime(endDT.toISOString())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A1A1AA]">Duration</span>
                          <span className="text-white font-semibold">{durationHours} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A1A1AA]">Rate</span>
                          <span className="text-white font-semibold">₹{selectedVehicle.pricePerHour}/hr</span>
                        </div>
                        {(selectedVehicle.securityDeposit ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-[#A1A1AA]">Security Deposit</span>
                            <span className="text-white font-semibold">₹{selectedVehicle.securityDeposit}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/15">
                          <span className="text-white font-black">Total</span>
                          <span className="text-white font-black text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {durationError && (
                      <p className="mb-4 text-xs text-neutral-400 flex items-center gap-1"><XCircle size={13} />{durationError}</p>
                    )}
                    {bookingError && (
                      <p className="mb-4 text-xs text-neutral-400 flex items-center gap-1"><XCircle size={13} />{bookingError}</p>
                    )}

                    <button onClick={handleBook} disabled={bookingLoading || !!durationError}
                      className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                      {bookingLoading ? <><Loader2 size={16} className="animate-spin" />Sending Request...</> : 'Request Booking'}
                    </button>
                    <p className="text-[10px] text-[#A1A1AA] text-center mt-2">The host will review and accept or reject your request.</p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

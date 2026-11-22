import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SearchX } from 'lucide-react';
import VehicleCard from '../../components/vehicle/VehicleCard';
import { vehicles } from '../../data/vehicles';
import type { VehicleCategory } from '../../types';

const VehiclesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | VehicleCategory>(
    (searchParams.get('category') as VehicleCategory) || 'all'
  );

  const categoryFilters: { label: string; value: 'all' | VehicleCategory }[] = [
    { label: 'All Vehicles', value: 'all' },
    { label: 'Bikes & Scooters', value: 'bike' },
    { label: 'Cars & SUVs', value: 'car' },
  ];

  const filtered = vehicles.filter((v) => {
    const matchCat = activeCategory === 'all' || v.category === activeCategory;
    const matchSearch =
      !search ||
      (v.name || `${v.brand} ${v.model}`).toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase()) ||
      (v.location || v.area || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#000000] pt-20 text-white textured-surface">
      {/* Page header */}
      <div className="border-b border-white/10 py-16 px-4 bg-[#0A0A0A]/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
            Verified Rental Fleet
          </div>
          <h1 className="text-white font-black text-3xl sm:text-5xl tracking-tight mb-2">Explore Fleet</h1>
          <p className="text-[#A1A1AA] text-sm">{filtered.length} verified vehicles available for instant rental</p>

          {/* Search bar */}
          <div className="relative mt-8 max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vehicle name, model, or Bangalore hub..."
              className="w-full h-12 pl-10 pr-10 rounded-2xl glass-card text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto pb-1">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-white text-black shadow-lg shadow-white/10 font-extrabold'
                  : 'glass-card text-[#A1A1AA] hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-3xl my-8 border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mx-auto mb-4 text-[#A1A1AA]">
              <SearchX size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No vehicles found</h3>
            <p className="text-[#A1A1AA] text-sm mb-6 max-w-sm mx-auto">
              We couldn't find matches for "{search}". Try searching for Royal Enfield, Innova, or Swift.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesPage;

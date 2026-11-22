import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cities } from '../../data/vehicles';
import type { VehicleCategory } from '../../types';

const categories: { label: string; value: VehicleCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Bikes & Scooters', value: 'bike' },
  { label: 'Cars & SUVs', value: 'car' },
];

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<'all' | VehicleCategory>('all');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category !== 'all') params.set('category', category);
    if (date) params.set('date', date);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-2xl p-2.5 flex flex-col md:flex-row gap-2.5 max-w-3xl mx-auto shadow-2xl"
    >
      {/* City */}
      <div className="relative flex-1 min-w-0">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full h-12 pl-10 pr-8 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#111111] text-white">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c} className="bg-[#111111] text-white">{c}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
      </div>

      {/* Category */}
      <div className="relative min-w-[170px]">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'all' | VehicleCategory)}
          className="w-full h-12 pl-4 pr-8 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all appearance-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#111111] text-white">{c.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
      </div>

      {/* Date */}
      <div className="relative min-w-[160px]">
        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/[0.08] transition-all cursor-pointer"
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 justify-center bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-7 h-12 rounded-xl transition-all shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.99] whitespace-nowrap cursor-pointer"
      >
        <Search size={16} />
        <span>Search</span>
      </button>
    </motion.div>
  );
};

export default SearchBar;

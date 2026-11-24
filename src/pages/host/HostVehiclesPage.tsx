import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin, Star, ToggleLeft, ToggleRight, Car } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';

export default function HostVehiclesPage() {
  const { currentUser } = useAuth();
  const { vehicles, updateVehicle, removeVehicle } = useApp();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);

  const myVehicles = vehicles.filter(v =>
    (v.hostId && v.hostId === currentUser?.id) ||
    (v.ownerId && v.ownerId === currentUser?.id) ||
    (!v.hostId && !v.ownerId)
  );

  const toggleActive = (v: Parameters<typeof updateVehicle>[0]) => {
    updateVehicle({ ...v, isActive: !v.isActive, updatedAt: new Date().toISOString() });
  };

  const confirmDelete = (id: string) => {
    removeVehicle(id);
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">My Vehicles</h1>
            <p className="text-[#A1A1AA] text-sm mt-0.5">{myVehicles.length} listing{myVehicles.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/host/vehicles/add"
            className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg hover:scale-[1.02]">
            <Plus size={15} />Add Vehicle
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {myVehicles.length === 0 ? (
          <div className="glass-card rounded-2xl p-14 text-center border border-white/10">
            <Car size={36} className="text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-black text-lg mb-2">No vehicles listed yet</h3>
            <p className="text-[#A1A1AA] text-sm mb-6">Add your first vehicle and start earning.</p>
            <Link to="/host/vehicles/add"
              className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-sm px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all">
              <Plus size={15} />Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myVehicles.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto bg-[#0A0A0A] shrink-0">
                  <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                  {!v.isActive && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-xs font-black text-white uppercase tracking-wider border border-white/30 px-3 py-1 rounded-full">Inactive</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-black text-white text-base">{v.brand} {v.model} ({v.year})</h3>
                      <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs mt-1">
                        <MapPin size={11} />{v.area}, {v.city}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-black text-xl">₹{v.pricePerHour}<span className="text-[#A1A1AA] text-xs font-normal">/hr</span></div>
                      {(v.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Star size={11} className="fill-white stroke-none" />
                          <span className="text-xs text-white">{v.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-auto flex-wrap">
                    <button onClick={() => toggleActive(v)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
                      {v.isActive ? <ToggleRight size={18} className="text-white" /> : <ToggleLeft size={18} />}
                      {v.isActive ? 'Active' : 'Inactive'}
                    </button>

                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => navigate(`/host/vehicles/edit/${v.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-white/20 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer transition-all">
                        <Edit size={13} />Edit
                      </button>

                      {deleting === v.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => confirmDelete(v.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer">
                            <Trash2 size={13} />Confirm
                          </button>
                          <button onClick={() => setDeleting(null)}
                            className="px-3 py-1.5 rounded-xl glass-card border border-white/20 text-xs font-semibold text-[#A1A1AA] hover:text-white cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleting(v.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-white/20 text-xs font-semibold text-[#A1A1AA] hover:text-white hover:border-white/40 cursor-pointer transition-all">
                          <Trash2 size={13} />Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

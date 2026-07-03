import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Car, DollarSign, Users, Calendar, TrendingUp, Star } from 'lucide-react';

interface Stats {
  total_users: number;
  total_cars: number;
  total_bookings: number;
  active_bookings: number;
  total_revenue: number;
  recent_bookings: any[];
  top_cars: any[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<Stats>('/admin/stats');
        setStats(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-neutral-500 text-sm">Failed to load dashboard stats.</p>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cars', value: stats.total_cars, icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Revenue', value: `৳${stats.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Bookings', value: stats.active_bookings, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl relative overflow-hidden">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">{s.label}</p>
            <span className="text-xl font-bold text-neutral-900 font-display">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
          <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-600" /> Recent Bookings
          </h3>
          <div className="space-y-2">
            {stats.recent_bookings.length > 0 ? stats.recent_bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-neutral-400" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{b.car?.name || 'Unknown'} — {b.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-neutral-500">{b.pickup_date} → {b.return_date}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${b.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' : b.status === 'Completed' ? 'bg-green-50 text-green-600' : b.status === 'Active' ? 'bg-purple-50 text-purple-600' : 'bg-neutral-100 text-neutral-500'}`}>{b.status}</span>
              </div>
            )) : <p className="text-neutral-400 text-xs text-center py-4">No bookings yet</p>}
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
          <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star size={14} className="text-amber-500" /> Top Rated Cars
          </h3>
          <div className="space-y-2">
            {stats.top_cars.map((car: any) => (
              <div key={car.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="w-14 h-10 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 truncate">{car.name}</p>
                  <p className="text-[10px] text-neutral-500">{car.brand} · {car.bookings_count} bookings</p>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={11} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-neutral-800">{car.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

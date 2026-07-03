import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Save, X } from 'lucide-react';
import { bookingsApi, type Booking } from '../lib/api';

const STATUS_OPTIONS = [
  { value: 'Upcoming', label: 'Upcoming', color: 'bg-blue-50 text-blue-600' },
  { value: 'Confirmed', label: 'Confirmed', color: 'bg-indigo-50 text-indigo-600' },
  { value: 'Driver Assigned', label: 'Driver Assigned', color: 'bg-purple-50 text-purple-600' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-amber-50 text-amber-600' },
  { value: 'Completed', label: 'Completed', color: 'bg-green-50 text-green-600' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-600' },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchBookings = async (p = 1) => {
    setLoading(true);
    try {
      const res = await bookingsApi.list(p);
      setBookings(res.data);
      setLastPage(res.last_page);
      setPage(p);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleSave = async () => {
    if (!editBooking || !editStatus) return;
    setSaving(true);
    try {
      await bookingsApi.updateStatus(String(editBooking.id), editStatus);
      setBookings(prev => prev.map(b =>
        b.id === editBooking.id ? { ...b, status: editStatus as Booking['status'] } : b
      ));
      setEditBooking(null);
    } catch (e) {
      console.error('Failed to update booking:', e);
    }
    setSaving(false);
  };

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.booking_ref?.toLowerCase().includes(q) ||
      String(b.id).includes(q) ||
      String(b.user_id).includes(q) ||
      b.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
          <p className="text-sm text-neutral-500">Manage and update booking statuses</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl p-3">
        <Search size={16} className="text-neutral-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by ref, user ID, or status..."
          className="bg-transparent text-sm outline-none w-full" />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Ref</th>
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">User</th>
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Car</th>
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Dates</th>
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Amount</th>
                <th className="text-left px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Status</th>
                <th className="text-right px-4 py-3 text-[10px] font-display uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">No bookings found</td></tr>
              ) : (
                filtered.map(booking => (
                  <tr key={booking.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono font-bold text-accent-blue">{booking.booking_ref}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-neutral-800">User #{booking.user_id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-neutral-800">Car #{booking.car_id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[10px] text-neutral-500">{booking.pickup_date} → {booking.return_date}</p>
                      <p className="text-[10px] text-neutral-400">{booking.total_days} day{booking.total_days > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-neutral-800">{formatPrice(Number(booking.total_price))}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditBooking(booking); setEditStatus(booking.status); }}
                        className="text-xs text-accent-blue hover:text-accent-blue-hover font-bold transition-colors cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">Page {page} of {lastPage}</p>
            <div className="flex gap-2">
              <button onClick={() => fetchBookings(page - 1)} disabled={page <= 1}
                className="px-3 py-1 text-xs bg-neutral-100 rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer">
                Previous
              </button>
              <button onClick={() => fetchBookings(page + 1)} disabled={page >= lastPage}
                className="px-3 py-1 text-xs bg-neutral-100 rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditBooking(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider">Update Booking</h3>
              <button onClick={() => setEditBooking(null)} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Reference</span>
                <span className="font-mono font-bold text-accent-blue">{editBooking.booking_ref}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">User</span>
                <span className="font-semibold text-neutral-800">#{editBooking.user_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Amount</span>
                <span className="font-semibold text-neutral-800">{formatPrice(Number(editBooking.total_price))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Dates</span>
                <span className="font-semibold text-neutral-800">{editBooking.pickup_date} → {editBooking.return_date}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-2 block">Update Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => setEditStatus(s.value)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border-2 ${
                      editStatus === s.value
                        ? `${s.color} border-current`
                        : 'bg-neutral-50 text-neutral-500 border-transparent hover:border-neutral-200'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditBooking(null)}
                className="flex-1 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || editStatus === editBooking.status}
                className="flex-1 py-2.5 bg-accent-blue text-white text-sm font-bold rounded-xl hover:bg-accent-blue-hover disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function formatPrice(amount: number) {
  return '৳' + amount.toLocaleString();
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Upcoming': return 'bg-blue-50 text-blue-600';
    case 'Confirmed': return 'bg-indigo-50 text-indigo-600';
    case 'Driver Assigned': return 'bg-purple-50 text-purple-600';
    case 'In Progress': return 'bg-amber-50 text-amber-600';
    case 'Completed': return 'bg-green-50 text-green-600';
    case 'Cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-neutral-50 text-neutral-600';
  }
}

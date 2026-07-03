import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { reviewLinksApi } from '../lib/api';

interface ReviewLinkItem {
  id: number;
  booking_id: number;
  car_id: number;
  token: string;
  url: string;
  used: boolean;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  booking?: { id: number; booking_ref: string; total_price: string };
  car?: { id: number; name: string; brand: string; image: string };
  user?: { id: number; name: string; email: string };
}

export default function AdminReviewLinks() {
  const [links, setLinks] = useState<ReviewLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res: any = await reviewLinksApi.list();
      const items = Array.isArray(res) ? res : (res?.data || []);
      setLinks(items);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleGenerate = async () => {
    if (!bookingIdInput) return;
    setGenerating(true);
    try {
      await reviewLinksApi.generate(parseInt(bookingIdInput));
      setBookingIdInput('');
      fetchLinks();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const getFullUrl = (url: string) => `${window.location.origin}${url}`;

  const copyLink = (url: string, id: number) => {
    navigator.clipboard.writeText(getFullUrl(url));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Review Links</h1>
          <p className="text-sm text-neutral-500 mt-1">Generate and manage review request links for customers</p>
        </div>
        <button onClick={fetchLinks} className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Generate new link */}
      <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
        <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-3">Generate Review Link</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={bookingIdInput}
            onChange={e => setBookingIdInput(e.target.value)}
            placeholder="Enter Booking ID"
            className="flex-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={generating || !bookingIdInput}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Link size={14} />
            {generating ? 'Generating...' : 'Generate Link'}
          </button>
        </div>
        <p className="text-[10px] text-neutral-400 mt-2">Links expire after 30 days. Customer can submit a review without logging in.</p>
      </div>

      {/* Links table */}
      <div className="bg-white border border-neutral-200/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Booking</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Car</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Customer</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Status</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Expires</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr key={link.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-xs font-mono font-bold text-accent-blue">{link.booking?.booking_ref || `#${link.booking_id}`}</p>
                    <p className="text-[10px] text-neutral-400">ID: {link.booking_id}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {link.car?.image && <img src={link.car.image} alt="" className="w-8 h-6 rounded object-cover" />}
                      <span className="text-xs font-semibold text-neutral-700">{link.car ? `${link.car.brand} ${link.car.name}` : `Car #${link.car_id}`}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-neutral-700">{link.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-neutral-400">{link.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {link.used ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 w-fit mx-auto">
                        <CheckCircle size={10} /> Used
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1 w-fit mx-auto">
                        <Clock size={10} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-[10px] text-neutral-400">
                      {link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {!link.used && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyLink(link.url, link.id)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copied === link.id ? <><CheckCircle size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                        </button>
                        <a href={getFullUrl(link.url)} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] font-bold text-neutral-500 hover:text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                          <ExternalLink size={10} /> Open
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && links.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-neutral-400 text-sm">No review links yet. Generate one above.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={6} className="text-center py-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

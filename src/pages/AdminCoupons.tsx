import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Tag, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_booking_amount: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_booking_amount: '',
    max_uses: '',
    starts_at: '',
    expires_at: '',
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons');
      setCoupons(data.data || data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        min_booking_amount: form.min_booking_amount ? parseFloat(form.min_booking_amount) : null,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        starts_at: form.starts_at || null,
        expires_at: form.expires_at || null,
      };
      if (editing) {
        await api.put(`/admin/coupons/${editing.id}`, payload);
      } else {
        await api.post('/admin/coupons', payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ code: '', type: 'percentage', value: '', min_booking_amount: '', max_uses: '', starts_at: '', expires_at: '' });
      fetchCoupons();
    } catch {}
  };

  const handleEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      min_booking_amount: coupon.min_booking_amount ? String(coupon.min_booking_amount) : '',
      max_uses: coupon.max_uses ? String(coupon.max_uses) : '',
      starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Coupons</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage discount codes</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ code: '', type: 'percentage', value: '', min_booking_amount: '', max_uses: '', starts_at: '', expires_at: '' }); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/60 shadow-sm p-6 rounded-2xl mb-6">
          <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-widest mb-4">{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Code *</label>
              <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20" className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (৳)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Value *</label>
              <input required type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 500'} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Min Amount</label>
              <input type="number" step="0.01" value={form.min_booking_amount} onChange={e => setForm({ ...form, min_booking_amount: e.target.value })}
                placeholder="Optional" className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })}
                placeholder="Unlimited" className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Expires At</label>
              <input type="datetime-local" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="bg-neutral-100 text-neutral-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-neutral-200">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-neutral-200/60 shadow-sm p-12 rounded-2xl text-center">
          <Tag size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No coupons yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/60 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Code</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Type</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Value</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Used</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Status</th>
                <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-6 py-4"><span className="font-mono font-bold text-sm text-neutral-800 bg-neutral-100 px-2 py-1 rounded">{c.code}</span></td>
                  <td className="px-6 py-4 text-sm text-neutral-600 capitalize">{c.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-800">{c.type === 'percentage' ? `${c.value}%` : `৳${c.value}`}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td className="px-6 py-4">
                    {c.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={10} /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full"><XCircle size={10} /> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(c)} className="p-1.5 text-neutral-400 hover:text-blue-600 rounded-lg"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

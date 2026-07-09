import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DollarSign, Plus, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

interface PricingRule {
  id: number;
  name: string;
  type: string;
  multiplier: number;
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[] | null;
  is_active: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminPricing() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PricingRule | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'peak_hour',
    multiplier: '',
    start_time: '',
    end_time: '',
    days_of_week: [] as number[],
  });

  const fetchRules = async () => {
    try {
      const { data } = await api.get('/admin/pricing/rules');
      setRules(data.data || data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        multiplier: parseFloat(form.multiplier),
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        days_of_week: form.days_of_week.length > 0 ? form.days_of_week : null,
      };
      if (editing) {
        await api.put(`/admin/pricing/rules/${editing.id}`, payload);
      } else {
        await api.post('/admin/pricing/rules', payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', type: 'peak_hour', multiplier: '', start_time: '', end_time: '', days_of_week: [] });
      fetchRules();
    } catch {}
  };

  const handleEdit = (rule: PricingRule) => {
    setEditing(rule);
    setForm({
      name: rule.name,
      type: rule.type,
      multiplier: String(rule.multiplier),
      start_time: rule.start_time || '',
      end_time: rule.end_time || '',
      days_of_week: rule.days_of_week || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this rule?')) return;
    try { await api.delete(`/admin/pricing/rules/${id}`); fetchRules(); } catch {}
  };

  const toggleDay = (day: number) => {
    setForm(f => ({
      ...f,
      days_of_week: f.days_of_week.includes(day)
        ? f.days_of_week.filter(d => d !== day)
        : [...f.days_of_week, day],
    }));
  };

  const typeLabels: Record<string, string> = {
    peak_hour: 'Peak Hour',
    weekend: 'Weekend',
    holiday: 'Holiday',
    seasonal: 'Seasonal',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Dynamic Pricing</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage surge pricing rules</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', type: 'peak_hour', multiplier: '', start_time: '', end_time: '', days_of_week: [] }); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/60 shadow-sm p-6 rounded-2xl mb-6">
          <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-widest mb-4">{editing ? 'Edit Rule' : 'New Rule'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Peak Hours" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm">
                <option value="peak_hour">Peak Hour</option>
                <option value="weekend">Weekend</option>
                <option value="holiday">Holiday</option>
                <option value="seasonal">Seasonal</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Multiplier *</label>
              <input required type="number" step="0.01" min="1" max="5" value={form.multiplier} onChange={e => setForm({ ...form, multiplier: e.target.value })}
                placeholder="e.g. 1.50" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
              <p className="text-[10px] text-neutral-400 mt-1">1.00 = no change, 1.50 = 50% more</p>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Start Time</label>
              <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">End Time</label>
              <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-2 block">Days of Week</label>
            <div className="flex gap-2">
              {DAYS.map((day, i) => (
                <button key={i} type="button" onClick={() => toggleDay(i)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium ${form.days_of_week.includes(i) ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="bg-neutral-100 text-neutral-600 px-6 py-2 rounded-xl text-sm font-medium hover:bg-neutral-200">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : rules.length === 0 ? (
        <div className="bg-white border border-neutral-200/60 shadow-sm p-12 rounded-2xl text-center">
          <DollarSign size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No pricing rules yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map(rule => (
            <div key={rule.id} className={`bg-white border shadow-sm p-5 rounded-2xl ${rule.is_active ? 'border-neutral-200/60' : 'border-red-200 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{typeLabels[rule.type] || rule.type}</span>
                  <h3 className="font-bold text-neutral-800 mt-2">{rule.name}</h3>
                </div>
                <span className="text-xl font-bold text-green-600">{rule.multiplier}x</span>
              </div>
              {rule.start_time && rule.end_time && (
                <p className="text-xs text-neutral-500 mb-2">{rule.start_time} - {rule.end_time}</p>
              )}
              {rule.days_of_week && rule.days_of_week.length > 0 && (
                <div className="flex gap-1 mb-3">
                  {rule.days_of_week.map(d => (
                    <span key={d} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">{DAYS[d]}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(rule)} className="flex items-center gap-1 text-xs text-neutral-600 hover:text-blue-600 border border-neutral-200 px-3 py-1.5 rounded-lg">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(rule.id)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

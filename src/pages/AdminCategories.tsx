import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { api } from '../lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data?: Category } | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: '', sort_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/admin/categories');
      setCategories(Array.isArray(res) ? res : (res?.data || []));
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modal?.mode === 'edit' && modal.data) {
        await api.put(`/admin/categories/${modal.data.id}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      setModal(null);
      fetchCategories();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await api.put(`/admin/categories/${cat.id}`, { is_active: !cat.is_active });
      fetchCategories();
    } catch {}
  };

  const moveUp = async (cat: Category, index: number) => {
    if (index === 0) return;
    const prev = categories[index - 1];
    try {
      await api.put(`/admin/categories/${cat.id}`, { sort_order: prev.sort_order - 1 });
      fetchCategories();
    } catch {}
  };

  const moveDown = async (cat: Category, index: number) => {
    if (index === categories.length - 1) return;
    const next = categories[index + 1];
    try {
      await api.put(`/admin/categories/${cat.id}`, { sort_order: next.sort_order + 1 });
      fetchCategories();
    } catch {}
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">{categories.length} car categories</p>
        </div>
        <button onClick={() => { setForm({ name: '', description: '', icon: '', image: '', sort_order: categories.length, is_active: true }); setModal({ mode: 'add' }); }}
          className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5">
          <Plus size={12} /> Add Category
        </button>
      </div>

      <div className="bg-white border border-neutral-200/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3 w-8"></th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Category</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Slug</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Description</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Sort</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Status</th>
                <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveUp(cat, i)} className="text-neutral-300 hover:text-neutral-600 cursor-pointer text-[10px]">▲</button>
                      <button onClick={() => moveDown(cat, i)} className="text-neutral-300 hover:text-neutral-600 cursor-pointer text-[10px]">▼</button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{cat.name}</p>
                      {cat.icon && <p className="text-[10px] text-neutral-400">Icon: {cat.icon}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-neutral-500">{cat.slug}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-neutral-500">{cat.description || '—'}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xs font-bold text-neutral-600">{cat.sort_order}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => toggleActive(cat)} className="cursor-pointer">
                      {cat.is_active ? (
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 w-fit mx-auto"><Eye size={10} /> Active</span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full flex items-center gap-1 w-fit mx-auto"><EyeOff size={10} /> Hidden</span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', image: cat.image || '', sort_order: cat.sort_order, is_active: cat.is_active }); setModal({ mode: 'edit', data: cat }); }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(cat.id)}
                        className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"><Trash2 size={10} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && categories.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-neutral-400 text-sm">No categories yet</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} className="text-center py-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Category' : 'Edit Category'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electric SUV"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Icon Name</label>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g. SUV"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1 block">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="accent-blue-600 rounded" />
              <label className="text-xs text-neutral-600">Active (visible on frontend)</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-neutral-200 text-sm font-bold text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={14} /> Save</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

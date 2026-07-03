import { useState } from 'react';
import { useCMSStore, type AboutStat, type AboutValue } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea, Select } from '../components/ui/Modal';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;
const iconOptions = ['Shield', 'DollarSign', 'Headphones', 'Zap', 'Star', 'Heart', 'Award', 'Globe', 'Users', 'TrendingUp', 'Car', 'CheckCircle'];

function StatModal({ item, onSave, onClose }: { item: AboutStat | null; onSave: (s: AboutStat) => void; onClose: () => void }) {
  const [form, setForm] = useState<AboutStat>(item || { id: `as${Date.now()}`, value: '', label: '' });
  return (<Modal title={item ? 'Edit Stat' : 'New Stat'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Value"><Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="50+" /></FormField>
      <FormField label="Label"><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Vehicles" /></FormField>
    </div>
  </Modal>);
}

function ValueModal({ item, onSave, onClose }: { item: AboutValue | null; onSave: (v: AboutValue) => void; onClose: () => void }) {
  const [form, setForm] = useState<AboutValue>(item || { id: `av${Date.now()}`, title: '', desc: '', icon: 'Star' });
  return (<Modal title={item ? 'Edit Value' : 'New Value'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></FormField>
        <FormField label="Icon"><Select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>{iconOptions.map(i => <option key={i} value={i}>{i}</option>)}</Select></FormField>
      </div>
      <FormField label="Description"><Textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} /></FormField>
    </div>
  </Modal>);
}

export default function AdminAbout() {
  const { about, updateAboutHero, updateAboutStats, updateAboutValues, updateAboutCta } = useCMSStore();
  const [hero, setHero] = useState(about.hero);
  const [stats, setStats] = useState<AboutStat[]>(about.stats);
  const [values, setValues] = useState<AboutValue[]>(about.values);
  const [cta, setCta] = useState(about.cta);
  const [saved, setSaved] = useState(false);
  const [statModal, setStatModal] = useState<ModalState>(null);
  const [valueModal, setValueModal] = useState<ModalState>(null);

  const handleSave = () => { updateAboutHero(hero); updateAboutStats(stats); updateAboutValues(values); updateAboutCta(cta); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const addStat = (s: AboutStat) => setStats([...stats, s]);
  const updateStat = (s: AboutStat) => setStats(stats.map(st => st.id === s.id ? s : st));
  const removeStat = (id: string) => setStats(stats.filter(s => s.id !== id));
  const addValue = (v: AboutValue) => setValues([...values, v]);
  const updateValue = (v: AboutValue) => setValues(values.map(val => val.id === v.id ? v : val));
  const removeValue = (id: string) => setValues(values.filter(v => v.id !== id));
  const editingStat = statModal?.mode === 'edit' ? stats.find(s => s.id === statModal.id) || null : null;
  const editingValue = valueModal?.mode === 'edit' ? values.find(v => v.id === valueModal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900">About Page</h1><p className="text-sm text-neutral-500 mt-1">Manage About page content</p></div>
        <div className="flex gap-2">
          <button onClick={() => { setHero(about.hero); setStats(about.stats); setValues(about.values); setCta(about.cta); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tagline"><Input value={hero.tagline} onChange={e => setHero({ ...hero, tagline: e.target.value })} /></FormField>
            <FormField label="Title"><Input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} /></FormField>
          </div>
          <FormField label="Description"><Textarea value={hero.description} onChange={e => setHero({ ...hero, description: e.target.value })} rows={3} /></FormField>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Stats</h2>
          <button onClick={() => setStatModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-2">
          {stats.map(s => (
            <div key={s.id} className="flex items-center gap-3 border border-neutral-100 rounded-xl p-3 hover:bg-neutral-50">
              <span className="text-lg font-bold text-accent-blue w-16">{s.value}</span>
              <span className="flex-1 text-sm">{s.label}</span>
              <button onClick={() => setStatModal({ mode: 'edit', id: s.id })} className="p-1.5 text-neutral-400 hover:text-amber-500 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removeStat(s.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Values</h2>
          <button onClick={() => setValueModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-3">
          {values.map(v => (
            <div key={v.id} className="flex items-center gap-3 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><span className="text-xs font-bold">{v.icon}</span></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{v.title}</p><p className="text-xs text-neutral-400 line-clamp-1">{v.desc}</p></div>
              <button onClick={() => setValueModal({ mode: 'edit', id: v.id })} className="p-1.5 text-neutral-400 hover:text-amber-500 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removeValue(v.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Call to Action</h2>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="CTA Text"><Input value={cta.ctaText || ''} onChange={e => setCta({ ...cta, ctaText: e.target.value })} /></FormField>
          <FormField label="CTA Link"><Input value={cta.ctaLink || ''} onChange={e => setCta({ ...cta, ctaLink: e.target.value })} /></FormField>
        </div>
      </div>
      {statModal?.mode === 'add' && <StatModal item={null} onSave={addStat} onClose={() => setStatModal(null)} />}
      {statModal?.mode === 'edit' && <StatModal item={editingStat} onSave={updateStat} onClose={() => setStatModal(null)} />}
      {valueModal?.mode === 'add' && <ValueModal item={null} onSave={addValue} onClose={() => setValueModal(null)} />}
      {valueModal?.mode === 'edit' && <ValueModal item={editingValue} onSave={updateValue} onClose={() => setValueModal(null)} />}
    </div>
  );
}

import { useState } from 'react';
import { useCMSStore, type Feature, type Stat } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

const iconOptions = ['Shield', 'MapPin', 'CheckCircle', 'Clock', 'Car', 'Star', 'Heart', 'Zap', 'Award', 'Globe', 'Users', 'TrendingUp', 'DollarSign', 'Headphones', 'Smartphone', 'Rocket'];

export default function AdminFeatures() {
  const { features, stats, updateFeatures, updateStats } = useCMSStore();
  const [feat, setFeat] = useState<Feature[]>(features);
  const [statItems, setStatItems] = useState<Stat[]>(stats);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { updateFeatures(feat); updateStats(statItems); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addFeature = () => setFeat([...feat, { id: `f${Date.now()}`, icon: 'Star', title: 'New Feature', desc: 'Description here' }]);
  const removeFeature = (id: string) => setFeat(feat.filter(f => f.id !== id));
  const updateFeature = (id: string, field: keyof Feature, value: string) => setFeat(feat.map(f => f.id === id ? { ...f, [field]: value } : f));

  const addStat = () => setStatItems([...statItems, { id: `s${Date.now()}`, value: '0', label: 'New Stat' }]);
  const removeStat = (id: string) => setStatItems(statItems.filter(s => s.id !== id));
  const updateStat = (id: string, field: keyof Stat, value: string) => setStatItems(statItems.map(s => s.id === id ? { ...s, [field]: value } : s));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Features & Stats</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage "Why Choose Us" features and homepage stats</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setFeat(features); setStatItems(stats); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Features (Why Choose Us)</h2>
          <button onClick={addFeature} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Feature</button>
        </div>
        <div className="space-y-4">
          {feat.map((f) => (
            <div key={f.id} className="border border-neutral-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">{f.id}</span>
                <button onClick={() => removeFeature(f.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Icon</label>
                  <select value={f.icon} onChange={e => updateFeature(f.id, 'icon', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none bg-white">
                    {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Title</label>
                  <input value={f.title} onChange={e => updateFeature(f.id, 'title', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Description</label>
                <textarea value={f.desc} onChange={e => updateFeature(f.id, 'desc', e.target.value)} rows={2}
                  className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none resize-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Stats Grid</h2>
          <button onClick={addStat} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Stat</button>
        </div>
        <div className="space-y-3">
          {statItems.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
              <input value={s.value} onChange={e => updateStat(s.id, 'value', e.target.value)} className="w-28 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none font-bold" placeholder="Value" />
              <input value={s.label} onChange={e => updateStat(s.id, 'label', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" placeholder="Label" />
              <button onClick={() => removeStat(s.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useCMSStore, type Brand } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

export default function AdminBrands() {
  const { brands, updateBrands } = useCMSStore();
  const [items, setItems] = useState<Brand[]>(brands);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { updateBrands(items); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const add = () => setItems([...items, { id: `b${Date.now()}`, name: 'New Brand', count: 0, logo: 'N' }]);
  const remove = (id: string) => setItems(items.filter(b => b.id !== id));
  const update = (id: string, field: keyof Brand, value: string | number) => setItems(items.map(b => b.id === id ? { ...b, [field]: value } : b));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Brands</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage car brands shown on homepage</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setItems(brands)} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Brand List</h2>
          <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Brand</button>
        </div>
        <div className="space-y-3">
          {items.map((brand) => (
            <div key={brand.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-600">{brand.logo}</div>
              <input value={brand.name} onChange={e => update(brand.id, 'name', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" placeholder="Brand name" />
              <input type="number" value={brand.count} onChange={e => update(brand.id, 'count', parseInt(e.target.value) || 0)} className="w-24 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" placeholder="Count" />
              <input value={brand.logo} onChange={e => update(brand.id, 'logo', e.target.value)} className="w-16 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none text-center" placeholder="Logo" />
              <button onClick={() => remove(brand.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

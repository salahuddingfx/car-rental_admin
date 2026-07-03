import { useState } from 'react';
import { useCMSStore, type Offer } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal, FormField, Input, Textarea } from '../components/ui/Modal';
import { FileUpload } from '../components/ui/FileUpload';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function OfferModal({ item, onSave, onClose }: { item: Offer | null; onSave: (o: Offer) => void; onClose: () => void }) {
  const [form, setForm] = useState<Offer>(item || { id: `o${Date.now()}`, title: '', description: '', ctaText: 'Learn More', ctaLink: '/cars', img: '', active: true });
  const u = (f: keyof Offer, v: string | boolean) => setForm({ ...form, [f]: v });
  return (
    <Modal title={item ? 'Edit Offer' : 'New Offer'} onSave={() => { onSave(form); onClose(); }} onClose={onClose} wide>
      <div className="space-y-4">
        <FormField label="Title"><Input value={form.title} onChange={e => u('title', e.target.value)} placeholder="Special Offer" /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={e => u('description', e.target.value)} rows={3} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA Text"><Input value={form.ctaText} onChange={e => u('ctaText', e.target.value)} /></FormField>
          <FormField label="CTA Link"><Input value={form.ctaLink} onChange={e => u('ctaLink', e.target.value)} /></FormField>
        </div>
        <FormField label="Image URL"><Input value={form.img} onChange={e => u('img', e.target.value)} /></FormField>
        <FileUpload value={form.img} onChange={url => u('img', url)} label="Offer Image" folder="images" />
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Status</label>
          <button onClick={() => u('active', !form.active)} className={form.active ? 'text-green-500' : 'text-neutral-300'}>
            {form.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
          <span className={`text-xs ${form.active ? 'text-green-600' : 'text-neutral-400'}`}>{form.active ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminOffers() {
  const { offers, updateOffers } = useCMSStore();
  const [items, setItems] = useState<Offer[]>(offers);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = () => { updateOffers(items); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const add = (o: Offer) => setItems([...items, o]);
  const update = (o: Offer) => setItems(items.map(i => i.id === o.id ? o : i));
  const remove = (id: string) => setItems(items.filter(i => i.id !== id));
  const toggleActive = (id: string) => setItems(items.map(i => i.id === id ? { ...i, active: !i.active } : i));
  const editingItem = modal?.mode === 'edit' ? items.find(i => i.id === modal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900">Offers</h1><p className="text-sm text-neutral-500 mt-1">Manage promotional offers</p></div>
        <div className="flex gap-2">
          <button onClick={() => setItems(offers)} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Offers ({items.length})</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Offer</button>
        </div>
        <div className="space-y-3">
          {items.map(offer => (
            <div key={offer.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50">
              {offer.img && <img src={offer.img} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{offer.title}</p>
                  <button onClick={() => toggleActive(offer.id)} className={offer.active ? 'text-green-500' : 'text-neutral-300'}>{offer.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1">{offer.description}</p>
              </div>
              <button onClick={() => setModal({ mode: 'edit', id: offer.id })} className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => remove(offer.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      {modal?.mode === 'add' && <OfferModal item={null} onSave={add} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <OfferModal item={editingItem} onSave={update} onClose={() => setModal(null)} />}
    </div>
  );
}

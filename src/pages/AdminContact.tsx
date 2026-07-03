import { useState } from 'react';
import { useCMSStore, type ContactInfo } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea, Select } from '../components/ui/Modal';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function InfoModal({ item, onSave, onClose }: { item: ContactInfo | null; onSave: (i: ContactInfo) => void; onClose: () => void }) {
  const [form, setForm] = useState<ContactInfo>(item || { id: `ci${Date.now()}`, type: 'email' as const, value: '', label: '' });
  return (
    <Modal title={item ? 'Edit Contact Info' : 'New Contact Info'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type"><Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ContactInfo['type'] })}><option value="email">Email</option><option value="phone">Phone</option><option value="office">Office</option></Select></FormField>
        <FormField label="Label"><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Email Us" /></FormField>
        <div className="col-span-2"><FormField label="Value"><Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="hello@apexride.com" /></FormField></div>
      </div>
    </Modal>
  );
}

export default function AdminContact() {
  const { contact, updateContactHero, updateContactInfos, updateContactFormLabels } = useCMSStore();
  const [hero, setHero] = useState(contact.hero);
  const [infos, setInfos] = useState<ContactInfo[]>(contact.infos);
  const [formLabels, setFormLabels] = useState(contact.formLabels);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = () => { updateContactHero(hero); updateContactInfos(infos); updateContactFormLabels(formLabels); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const add = (i: ContactInfo) => setInfos([...infos, i]);
  const update = (i: ContactInfo) => setInfos(infos.map(info => info.id === i.id ? i : info));
  const remove = (id: string) => setInfos(infos.filter(i => i.id !== id));
  const editingItem = modal?.mode === 'edit' ? infos.find(i => i.id === modal.id) || null : null;
  const typeIcons: Record<string, string> = { email: '✉️', phone: '📞', office: '📍' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900">Contact Page</h1><p className="text-sm text-neutral-500 mt-1">Manage contact page content</p></div>
        <div className="flex gap-2">
          <button onClick={() => { setHero(contact.hero); setInfos(contact.infos); setFormLabels(contact.formLabels); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
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
          <h2 className="text-lg font-semibold">Contact Info Cards</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-3">
          {infos.map(info => (
            <div key={info.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50">
              <span className="text-xl">{typeIcons[info.type] || '📝'}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{info.label}</p><p className="text-xs text-neutral-400">{info.value}</p></div>
              <button onClick={() => setModal({ mode: 'edit', id: info.id })} className="p-1.5 text-neutral-400 hover:text-amber-500 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => remove(info.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Form Labels</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(formLabels).map(([key, value]) => (
            <FormField key={key} label={key}><Input value={value} onChange={e => setFormLabels({ ...formLabels, [key]: e.target.value })} /></FormField>
          ))}
        </div>
      </div>
      {modal?.mode === 'add' && <InfoModal item={null} onSave={add} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <InfoModal item={editingItem} onSave={update} onClose={() => setModal(null)} />}
    </div>
  );
}

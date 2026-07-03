import { useState } from 'react';
import { useCMSStore, type FaqItem } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea } from '../components/ui/Modal';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function FaqModal({ item, onSave, onClose }: { item: FaqItem | null; onSave: (f: FaqItem) => void; onClose: () => void }) {
  const [form, setForm] = useState<FaqItem>(item || { id: `q${Date.now()}`, question: '', answer: '' });
  const u = (f: keyof FaqItem, v: string) => setForm({ ...form, [f]: v });

  return (
    <Modal title={item ? 'Edit FAQ' : 'New FAQ'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
      <div className="space-y-4">
        <FormField label="Question"><Input value={form.question} onChange={e => u('question', e.target.value)} placeholder="What documents do I need?" /></FormField>
        <FormField label="Answer"><Textarea value={form.answer} onChange={e => u('answer', e.target.value)} rows={5} placeholder="Write the answer here..." /></FormField>
      </div>
    </Modal>
  );
}

export default function AdminFaq() {
  const { faq, updateFaq } = useCMSStore();
  const [items, setItems] = useState<FaqItem[]>(faq);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = () => { updateFaq(items); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const add = (f: FaqItem) => setItems([...items, f]);
  const update = (f: FaqItem) => setItems(items.map(i => i.id === f.id ? f : i));
  const remove = (id: string) => setItems(items.filter(i => i.id !== id));
  const editingItem = modal?.mode === 'edit' ? items.find(i => i.id === modal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">FAQ</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage frequently asked questions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setItems(faq)} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Questions ({items.length})</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add FAQ</button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-start gap-3 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.question}</p>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.answer}</p>
              </div>
              <button onClick={() => setModal({ mode: 'edit', id: item.id })} className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg shrink-0"><Pencil size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {modal?.mode === 'add' && <FaqModal item={null} onSave={add} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <FaqModal item={editingItem} onSave={update} onClose={() => setModal(null)} />}
    </div>
  );
}

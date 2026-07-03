import { useState } from 'react';
import { useCMSStore, type SocialReview } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil, Star } from 'lucide-react';
import { Modal, FormField, Input, Textarea, Select } from '../components/ui/Modal';
import { FileUpload } from '../components/ui/FileUpload';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function ReviewModal({ item, onSave, onClose }: { item: SocialReview | null; onSave: (r: SocialReview) => void; onClose: () => void }) {
  const [form, setForm] = useState<SocialReview>(item || {
    id: `r${Date.now()}`, name: '', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    rating: 5, text: '', source: 'apexride' as const, date: new Date().toISOString().split('T')[0],
  });
  const u = (f: keyof SocialReview, v: string | number) => setForm({ ...form, [f]: v });

  return (
    <Modal title={item ? 'Edit Review' : 'New Review'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name"><Input value={form.name} onChange={e => u('name', e.target.value)} placeholder="John Doe" /></FormField>
          <FormField label="Source"><Select value={form.source} onChange={e => u('source', e.target.value)}><option value="google">Google</option><option value="facebook">Facebook</option><option value="tripadvisor">TripAdvisor</option><option value="apexride">Apex Ride</option></Select></FormField>
          <FormField label="Rating"><div className="flex items-center gap-1 mt-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => u('rating', n)} className={n <= form.rating ? 'text-amber-400' : 'text-neutral-200'}><Star size={20} fill={n <= form.rating ? 'currentColor' : 'none'} /></button>)}</div></FormField>
        </div>
        <FileUpload value={form.avatar} onChange={url => u('avatar', url)} label="Avatar Photo" folder="avatars" />
        <FormField label="Review Text"><Textarea value={form.text} onChange={e => u('text', e.target.value)} rows={4} placeholder="Write the review..." /></FormField>
      </div>
    </Modal>
  );
}

export default function AdminReviews() {
  const { reviews, updateReviews } = useCMSStore();
  const [hero, setHero] = useState(reviews.hero);
  const [items, setItems] = useState<SocialReview[]>(reviews.items);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = () => { updateReviews({ hero, items }); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const add = (r: SocialReview) => setItems([...items, r]);
  const update = (r: SocialReview) => setItems(items.map(i => i.id === r.id ? r : i));
  const remove = (id: string) => setItems(items.filter(i => i.id !== id));
  const editingItem = modal?.mode === 'edit' ? items.find(i => i.id === modal.id) || null : null;
  const sourceColors: Record<string, string> = { google: 'bg-red-50 text-red-600', facebook: 'bg-blue-50 text-blue-600', tripadvisor: 'bg-green-50 text-green-600', apexride: 'bg-amber-50 text-amber-600' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900">Reviews</h1><p className="text-sm text-neutral-500 mt-1">Manage social proof reviews</p></div>
        <div className="flex gap-2">
          <button onClick={() => { setHero(reviews.hero); setItems(reviews.items); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Tagline"><Input value={hero.tagline} onChange={e => setHero({ ...hero, tagline: e.target.value })} /></FormField>
          <FormField label="Title"><Input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} /></FormField>
          <div className="col-span-2"><FormField label="Description"><Textarea value={hero.description} onChange={e => setHero({ ...hero, description: e.target.value })} rows={2} /></FormField></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reviews ({items.length})</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Review</button>
        </div>
        <div className="space-y-3">
          {items.map(review => (
            <div key={review.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50 transition-colors">
              <img src={review.avatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{review.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sourceColors[review.source] || 'bg-neutral-100'}`}>{review.source}</span>
                  <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={10} className={n <= review.rating ? 'text-amber-400' : 'text-neutral-200'} fill={n <= review.rating ? 'currentColor' : 'none'} />)}</div>
                </div>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{review.text}</p>
              </div>
              <button onClick={() => setModal({ mode: 'edit', id: review.id })} className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => remove(review.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      {modal?.mode === 'add' && <ReviewModal item={null} onSave={add} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <ReviewModal item={editingItem} onSave={update} onClose={() => setModal(null)} />}
    </div>
  );
}

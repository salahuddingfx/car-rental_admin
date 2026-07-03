import { useState } from 'react';
import { useCMSStore, type HeroSlide } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, GripVertical, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea } from '../components/ui/Modal';
import { FileUpload } from '../components/ui/FileUpload';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function SlideModal({ slide, onSave, onClose }: { slide: HeroSlide | null; onSave: (s: HeroSlide) => void; onClose: () => void }) {
  const [form, setForm] = useState<HeroSlide>(slide || {
    id: `slide-${Date.now()}`, img: '', alt: '', tagline: '', title: '', subtitle: '', cta: 'Explore Fleet', ctaLink: '/cars',
  });
  const u = (f: keyof HeroSlide, v: string) => setForm({ ...form, [f]: v });

  return (
    <Modal title={slide ? 'Edit Slide' : 'New Slide'} onSave={() => { onSave(form); onClose(); }} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tagline"><Input value={form.tagline} onChange={e => u('tagline', e.target.value)} placeholder="PREMIUM LUXURY" /></FormField>
          <FormField label="Title"><Input value={form.title} onChange={e => u('title', e.target.value)} placeholder="Drive Your Dreams" /></FormField>
        </div>
        <FormField label="Subtitle"><Textarea value={form.subtitle} onChange={e => u('subtitle', e.target.value)} rows={2} placeholder="Subtitle text..." /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA Text"><Input value={form.cta} onChange={e => u('cta', e.target.value)} /></FormField>
          <FormField label="CTA Link"><Input value={form.ctaLink} onChange={e => u('ctaLink', e.target.value)} /></FormField>
        </div>
        <FormField label="Image URL"><Input value={form.img} onChange={e => u('img', e.target.value)} placeholder="https://unsplash.com/..." /></FormField>
        <FormField label="Alt Text"><Input value={form.alt} onChange={e => u('alt', e.target.value)} placeholder="Image description" /></FormField>
        <FileUpload value={form.img} onChange={url => u('img', url)} label="Slide Image" folder="images" />
      </div>
    </Modal>
  );
}

export default function AdminHero() {
  const { hero, updateHeroSlides, updateHeroStats } = useCMSStore();
  const [slides, setSlides] = useState<HeroSlide[]>(hero.slides);
  const [stats, setStats] = useState(hero.stats);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = () => { updateHeroSlides(slides); updateHeroStats(stats); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const addSlide = (s: HeroSlide) => setSlides([...slides, s]);
  const updateSlide = (s: HeroSlide) => setSlides(slides.map(sl => sl.id === s.id ? s : sl));
  const removeSlide = (id: string) => setSlides(slides.filter(s => s.id !== id));

  const addStat = () => setStats([...stats, { label: 'New Stat', value: '0' }]);
  const removeStat = (i: number) => setStats(stats.filter((_, idx) => idx !== i));
  const updateStat = (i: number, f: 'label' | 'value', v: string) => setStats(stats.map((s, idx) => idx === i ? { ...s, [f]: v } : s));

  const editingSlide = modal?.mode === 'edit' ? slides.find(s => s.id === modal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Hero Section</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage hero carousel slides and stats bar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setSlides(hero.slides); setStats(hero.stats); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Carousel Slides ({slides.length})</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Slide</button>
        </div>
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-3 hover:bg-neutral-50 transition-colors">
              <GripVertical size={16} className="text-neutral-300 shrink-0" />
              {slide.img && <img src={slide.img} alt="" className="w-24 h-16 object-cover rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{slide.title}</p>
                <p className="text-xs text-neutral-400">{slide.tagline}</p>
              </div>
              <span className="text-xs font-mono text-neutral-300">{i + 1}/{slides.length}</span>
              <button onClick={() => setModal({ mode: 'edit', id: slide.id })} className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removeSlide(slide.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Hero Stats Bar</h2>
          <button onClick={addStat} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Stat</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2 border border-neutral-100 rounded-xl p-3">
              <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="w-24 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none font-bold" />
              <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" />
              <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {modal?.mode === 'add' && <SlideModal slide={null} onSave={addSlide} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <SlideModal slide={editingSlide} onSave={updateSlide} onClose={() => setModal(null)} />}
    </div>
  );
}

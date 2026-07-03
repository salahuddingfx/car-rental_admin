import { useState } from 'react';
import { useCMSStore, type TimelineEvent, type ProcessStep } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea, Select } from '../components/ui/Modal';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;
const iconOptions = ['Rocket', 'MapPin', 'Smartphone', 'Car', 'Globe', 'Zap', 'Search', 'Calendar', 'Truck', 'Map', 'CheckCircle', 'Star', 'Award', 'Users', 'Heart', 'Shield'];

function EventModal({ item, onSave, onClose }: { item: TimelineEvent | null; onSave: (e: TimelineEvent) => void; onClose: () => void }) {
  const [form, setForm] = useState<TimelineEvent>(item || { id: `te${Date.now()}`, year: '', title: '', description: '', icon: 'Star', type: 'journey' });
  const u = (f: keyof TimelineEvent, v: string) => setForm({ ...form, [f]: v });
  return (<Modal title={item ? 'Edit Event' : 'New Event'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Year"><Input value={form.year} onChange={e => u('year', e.target.value)} placeholder="2024" /></FormField>
        <FormField label="Title"><Input value={form.title} onChange={e => u('title', e.target.value)} /></FormField>
        <FormField label="Icon"><Select value={form.icon} onChange={e => u('icon', e.target.value)}>{iconOptions.map(i => <option key={i} value={i}>{i}</option>)}</Select></FormField>
      </div>
      <FormField label="Description"><Textarea value={form.description} onChange={e => u('description', e.target.value)} rows={3} /></FormField>
    </div>
  </Modal>);
}

function StepModal({ item, onSave, onClose }: { item: ProcessStep | null; onSave: (s: ProcessStep) => void; onClose: () => void }) {
  const [form, setForm] = useState<ProcessStep>(item || { id: `ps${Date.now()}`, step: 1, title: '', description: '', icon: 'Search' });
  const u = (f: keyof ProcessStep, v: string | number) => setForm({ ...form, [f]: v });
  return (<Modal title={item ? 'Edit Step' : 'New Step'} onSave={() => { onSave(form); onClose(); }} onClose={onClose}>
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Step #"><Input type="number" value={form.step} onChange={e => u('step', parseInt(e.target.value) || 1)} /></FormField>
        <FormField label="Title"><Input value={form.title} onChange={e => u('title', e.target.value)} /></FormField>
        <FormField label="Icon"><Select value={form.icon} onChange={e => u('icon', e.target.value)}>{iconOptions.map(i => <option key={i} value={i}>{i}</option>)}</Select></FormField>
      </div>
      <FormField label="Description"><Textarea value={form.description} onChange={e => u('description', e.target.value)} rows={3} /></FormField>
    </div>
  </Modal>);
}

export default function AdminTimeline() {
  const { timeline, updateTimeline } = useCMSStore();
  const [events, setEvents] = useState<TimelineEvent[]>(timeline.events);
  const [steps, setSteps] = useState<ProcessStep[]>(timeline.processSteps);
  const [saved, setSaved] = useState(false);
  const [eventModal, setEventModal] = useState<ModalState>(null);
  const [stepModal, setStepModal] = useState<ModalState>(null);

  const handleSave = () => { updateTimeline({ events, processSteps: steps }); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const addEvent = (e: TimelineEvent) => setEvents([...events, e]);
  const updateEvent = (e: TimelineEvent) => setEvents(events.map(ev => ev.id === e.id ? e : ev));
  const removeEvent = (id: string) => setEvents(events.filter(e => e.id !== id));
  const addStep = (s: ProcessStep) => setSteps([...steps, s]);
  const updateStep = (s: ProcessStep) => setSteps(steps.map(st => st.id === s.id ? s : st));
  const removeStep = (id: string) => setSteps(steps.filter(s => s.id !== id));
  const editingEvent = eventModal?.mode === 'edit' ? events.find(e => e.id === eventModal.id) || null : null;
  const editingStep = stepModal?.mode === 'edit' ? steps.find(s => s.id === stepModal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-neutral-900">Timeline & Process</h1><p className="text-sm text-neutral-500 mt-1">Manage company journey and rental process</p></div>
        <div className="flex gap-2">
          <button onClick={() => { setEvents(timeline.events); setSteps(timeline.processSteps); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Company Journey ({events.length})</h2>
          <button onClick={() => setEventModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Event</button>
        </div>
        <div className="space-y-3">
          {events.map(e => (
            <div key={e.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50">
              <div className="w-14 text-center shrink-0"><p className="text-xs text-neutral-400">{e.icon}</p><p className="text-sm font-bold text-accent-blue">{e.year}</p></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{e.title}</p><p className="text-xs text-neutral-400 line-clamp-1">{e.description}</p></div>
              <button onClick={() => setEventModal({ mode: 'edit', id: e.id })} className="p-1.5 text-neutral-400 hover:text-amber-500 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removeEvent(e.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Rental Process ({steps.length})</h2>
          <button onClick={() => setStepModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Step</button>
        </div>
        <div className="space-y-3">
          {steps.map(s => (
            <div key={s.id} className="flex items-center gap-4 border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{s.title}</p><p className="text-xs text-neutral-400 line-clamp-1">{s.description}</p></div>
              <button onClick={() => setStepModal({ mode: 'edit', id: s.id })} className="p-1.5 text-neutral-400 hover:text-amber-500 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removeStep(s.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
      {eventModal?.mode === 'add' && <EventModal item={null} onSave={addEvent} onClose={() => setEventModal(null)} />}
      {eventModal?.mode === 'edit' && <EventModal item={editingEvent} onSave={updateEvent} onClose={() => setEventModal(null)} />}
      {stepModal?.mode === 'add' && <StepModal item={null} onSave={addStep} onClose={() => setStepModal(null)} />}
      {stepModal?.mode === 'edit' && <StepModal item={editingStep} onSave={updateStep} onClose={() => setStepModal(null)} />}
    </div>
  );
}

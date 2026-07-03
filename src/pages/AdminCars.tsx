import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore, refreshAdminData } from '../store/useAdminStore';
import { Star, MapPin, Trash2, Eye, EyeOff, Plus, Pencil } from 'lucide-react';
import { Modal, FormField, Input, Textarea, Select } from '../components/ui/Modal';
import { FileUpload, MultiFileUpload } from '../components/ui/FileUpload';
import { api } from '../lib/api';
import type { Car } from '../data/types';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function CarModal({ car, onSave, onClose }: { car: Car | null; onSave: (c: Car) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<Car>>(car || {
    name: '', brand: '', category: 'SUV', price: 0, seats: 5,
    transmission: 'Automatic', fuel: 'Petrol', power: '', speed: '',
    description: '', features: [], image: '', images: [], location: '',
    isAvailable: true, rating: 0, reviewsCount: 0,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [modalCategories, setModalCategories] = useState<{ name: string }[]>([]);
  const u = <K extends keyof Car>(f: K, v: Car[K]) => setForm({ ...form, [f]: v });

  useEffect(() => {
    api.get('/admin/categories').then((res: any) => setModalCategories(Array.isArray(res) ? res : (res?.data || []) as { name: string }[])).catch(() => {});
  }, []);

  const addFeature = () => {
    if (featureInput.trim()) {
      u('features', [...(form.features || []), featureInput.trim()]);
      setFeatureInput('');
    }
  };
  const removeFeature = (i: number) => u('features', (form.features || []).filter((_, idx) => idx !== i));

  return (
    <Modal title={car ? 'Edit Car' : 'Add New Car'} onSave={() => onSave(form as Car)} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Car Name"><Input value={form.name} onChange={e => u('name', e.target.value)} placeholder="Lamborghini Huracán" /></FormField>
          <FormField label="Brand"><Input value={form.brand} onChange={e => u('brand', e.target.value)} placeholder="Lamborghini" /></FormField>
          <FormField label="Category"><Select value={form.category} onChange={e => u('category', e.target.value)}>{modalCategories.length > 0 ? modalCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>) : <><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Van</option><option>Sports</option><option>Luxury</option><option>Supercar</option><option>Electric</option></>}</Select></FormField>
          <FormField label="Price per Day"><Input type="number" value={form.price} onChange={e => u('price', Number(e.target.value))} /></FormField>
          <FormField label="Seats"><Input type="number" value={form.seats} onChange={e => u('seats', Number(e.target.value))} /></FormField>
          <FormField label="Year"><Input value={form.year} onChange={e => u('year', e.target.value)} placeholder="2024" /></FormField>
          <FormField label="Transmission"><Select value={form.transmission} onChange={e => u('transmission', e.target.value as 'Automatic' | 'Manual')}><option>Automatic</option><option>Manual</option></Select></FormField>
          <FormField label="Fuel"><Select value={form.fuel} onChange={e => u('fuel', e.target.value as Car['fuel'])}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></Select></FormField>
          <FormField label="Power"><Input value={form.power} onChange={e => u('power', e.target.value)} placeholder="640 HP" /></FormField>
          <FormField label="Top Speed"><Input value={form.speed} onChange={e => u('speed', e.target.value)} placeholder="325 km/h" /></FormField>
        </div>
        <FormField label="Location"><Input value={form.location} onChange={e => u('location', e.target.value)} placeholder="Dhaka, Bangladesh" /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={e => u('description', e.target.value)} rows={3} placeholder="Describe the car..." /></FormField>

        <FileUpload value={form.image || ''} onChange={url => u('image', url)} label="Main Image" folder="images" />

        <MultiFileUpload value={form.images || []} onChange={urls => u('images', urls)} label="Gallery Images" folder="images" maxFiles={6} />

        <FormField label="Features">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {(form.features || []).map((f, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full text-xs">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="text-neutral-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Add feature..." />
              <button type="button" onClick={addFeature} className="px-3 py-2 text-xs bg-neutral-100 rounded-xl hover:bg-neutral-200">Add</button>
            </div>
          </div>
        </FormField>
      </div>
    </Modal>
  );
}

export default function AdminCars() {
  const { cars, addCar, deleteCar, editCar, toggleCarAvailability } = useAdminStore();
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<ModalState>(null);
  const [adminCategories, setAdminCategories] = useState<{ name: string }[]>([]);

  useEffect(() => { refreshAdminData(); }, []);
  useEffect(() => {
    api.get('/admin/categories').then((res: any) => setAdminCategories(Array.isArray(res) ? res : (res?.data || []) as { name: string }[])).catch(() => {});
  }, []);

  const filteredCars = filter === 'all' ? cars : cars.filter(c => c.category === filter);
  const editingCar = modal?.mode === 'edit' ? cars.find(c => c.id === modal.id) || null : null;

  const handleSave = (car: Car) => {
    if (modal?.mode === 'add') {
      addCar({ ...car, id: `car-${Date.now()}` });
    } else if (modal?.mode === 'edit') {
      editCar(modal.id, car);
    }
    setModal(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">All Cars</h1>
          <p className="text-sm text-neutral-500 mt-1">{cars.length} vehicles on platform</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...adminCategories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${filter === cat ? 'bg-blue-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-blue-300'}`}>
              {cat}
            </button>
          ))}
          <button onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer">
            <Plus size={12} /> Add Car
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Car</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Category</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Location</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Price</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Rating</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Status</th>
                <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map(car => (
                <tr key={car.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-11 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">{car.name}</p>
                        <p className="text-[10px] text-neutral-500">{car.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-blue-50 text-blue-600">{car.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-neutral-600">
                      <MapPin size={12} /> {car.location}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-bold text-neutral-800">৳{car.price}/d</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      <span className="font-bold text-neutral-800">{car.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleCarAvailability(car.id)}
                      className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full cursor-pointer ${car.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {car.isAvailable ? <><Eye size={11} /> Active</> : <><EyeOff size={11} /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal({ mode: 'edit', id: car.id })}
                        className="p-1.5 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { if (confirm('Delete this car?')) deleteCar(car.id); }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-neutral-400 text-sm">No cars found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal?.mode === 'add' && <CarModal car={null} onSave={handleSave} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <CarModal car={editingCar} onSave={handleSave} onClose={() => setModal(null)} />}
    </motion.div>
  );
}

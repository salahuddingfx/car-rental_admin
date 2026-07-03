import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api, cmsApi } from '../lib/api';
import { Settings, Save, Shield, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    commissionRate: 15,
    minBookingDays: 1,
    maxBookingDays: 30,
    autoApprove: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get<{ value: any }>('/cms/platform_settings');
        if (data?.value) {
          setSettings(prev => ({ ...prev, ...data.value }));
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await cmsApi.upsert('platform_settings', settings, 'settings');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Platform configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-display font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-neutral-200/60 shadow-sm p-6 rounded-2xl">
          <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Settings size={14} className="text-blue-600" /> General
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Platform Name</label>
              <input value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full border border-neutral-200 text-sm text-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Support Email</label>
              <input value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full border border-neutral-200 text-sm text-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 shadow-sm p-6 rounded-2xl">
          <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Shield size={14} className="text-blue-600" /> Booking Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Commission (%)</label>
              <input type="number" value={settings.commissionRate} onChange={e => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                className="w-full border border-neutral-200 text-sm text-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Min Days</label>
              <input type="number" value={settings.minBookingDays} onChange={e => setSettings({ ...settings, minBookingDays: Number(e.target.value) })}
                className="w-full border border-neutral-200 text-sm text-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Max Days</label>
              <input type="number" value={settings.maxBookingDays} onChange={e => setSettings({ ...settings, maxBookingDays: Number(e.target.value) })}
                className="w-full border border-neutral-200 text-sm text-neutral-800 p-2.5 rounded-xl outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
              className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${settings.autoApprove ? 'bg-blue-600' : 'bg-neutral-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.autoApprove ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs text-neutral-600">Auto-approve bookings</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

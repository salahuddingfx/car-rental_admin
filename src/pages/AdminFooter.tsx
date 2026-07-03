import { useState } from 'react';
import { useCMSStore, type FooterLink, type ContactInfo, type SocialLink } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

export default function AdminFooter() {
  const { footer, updateFooter } = useCMSStore();
  const [data, setData] = useState(footer);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { updateFooter(data); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addColumn = () => setData({ ...data, columns: [...data.columns, { id: `col${Date.now()}`, title: 'New Column', links: [] }] });
  const removeColumn = (id: string) => setData({ ...data, columns: data.columns.filter(c => c.id !== id) });
  const updateColumnTitle = (id: string, title: string) => setData({ ...data, columns: data.columns.map(c => c.id === id ? { ...c, title } : c) });

  const addLink = (colId: string) => {
    setData({ ...data, columns: data.columns.map(c => c.id === colId ? { ...c, links: [...c.links, { id: `fl${Date.now()}`, label: 'New Link', href: '/' }] } : c) });
  };
  const removeLink = (colId: string, linkId: string) => {
    setData({ ...data, columns: data.columns.map(c => c.id === colId ? { ...c, links: c.links.filter(l => l.id !== linkId) } : c) });
  };
  const updateLink = (colId: string, linkId: string, field: keyof FooterLink, value: string) => {
    setData({ ...data, columns: data.columns.map(c => c.id === colId ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) } : c) });
  };

  const addContact = () => setData({ ...data, contact: [...data.contact, { id: `fc${Date.now()}`, type: 'email' as const, value: '', label: '' }] });
  const removeContact = (id: string) => setData({ ...data, contact: data.contact.filter(c => c.id !== id) });
  const updateContact = (id: string, field: keyof ContactInfo, value: string) => setData({ ...data, contact: data.contact.map(c => c.id === id ? { ...c, [field]: value } : c) });

  const addSocial = () => setData({ ...data, socialLinks: [...data.socialLinks, { id: `sl${Date.now()}`, platform: 'New Platform', url: '', icon: '' }] });
  const removeSocial = (id: string) => setData({ ...data, socialLinks: data.socialLinks.filter(s => s.id !== id) });
  const updateSocial = (id: string, field: keyof SocialLink, value: string) => setData({ ...data, socialLinks: data.socialLinks.map(s => s.id === id ? { ...s, [field]: value } : s) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Footer</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage footer content, links, contact info, and social links</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setData(footer)} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      {/* Brand Description */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Brand</h2>
        <div className="space-y-3">
          <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Brand Description</label>
            <textarea value={data.brandDesc} onChange={e => setData({ ...data, brandDesc: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Copyright</label>
              <input value={data.copyright} onChange={e => setData({ ...data, copyright: e.target.value })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Developer Credit</label>
              <input value={data.developerCredit} onChange={e => setData({ ...data, developerCredit: e.target.value })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contact Info</h2>
          <button onClick={addContact} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-3">
          {data.contact.map(c => (
            <div key={c.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
              <select value={c.type} onChange={e => updateContact(c.id, 'type', e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white">
                <option value="email">Email</option><option value="phone">Phone</option><option value="office">Office</option>
              </select>
              <input value={c.label} onChange={e => updateContact(c.id, 'label', e.target.value)} className="w-24 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="Label" />
              <input value={c.value} onChange={e => updateContact(c.id, 'value', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="Value" />
              <button onClick={() => removeContact(c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <button onClick={addSocial} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add</button>
        </div>
        <div className="space-y-3">
          {data.socialLinks.map(s => (
            <div key={s.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
              <input value={s.platform} onChange={e => updateSocial(s.id, 'platform', e.target.value)} className="w-32 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="Platform" />
              <input value={s.url} onChange={e => updateSocial(s.id, 'url', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="URL" />
              <button onClick={() => removeSocial(s.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Link Columns */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Link Columns</h2>
          <button onClick={addColumn} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Column</button>
        </div>
        <div className="space-y-4">
          {data.columns.map(col => (
            <div key={col.id} className="border border-neutral-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <input value={col.title} onChange={e => updateColumnTitle(col.id, e.target.value)} className="text-sm font-semibold border-none p-0 focus:ring-0 bg-transparent" />
                <button onClick={() => removeColumn(col.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-2">
                {col.links.map(link => (
                  <div key={link.id} className="flex items-center gap-2">
                    <input value={link.label} onChange={e => updateLink(col.id, link.id, 'label', e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg" placeholder="Label" />
                    <input value={link.href} onChange={e => updateLink(col.id, link.id, 'href', e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-neutral-200 rounded-lg" placeholder="Href" />
                    <button onClick={() => removeLink(col.id, link.id)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addLink(col.id)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={12} /> Add Link</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useCMSStore, type NavbarLink } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

export default function AdminNavbar() {
  const { navbar, home, updateNavbar, updateHome } = useCMSStore();
  const [links, setLinks] = useState<NavbarLink[]>(navbar.links);
  const [homeData, setHomeData] = useState(home);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { updateNavbar({ links }); updateHome(homeData); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addLink = () => setLinks([...links, { id: `nl${Date.now()}`, label: 'New Link', href: '/' }]);
  const removeLink = (id: string) => setLinks(links.filter(l => l.id !== id));
  const updateLink = (id: string, field: keyof NavbarLink, value: string) => setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Navbar & Home Sections</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage navbar links and home page section headers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setLinks(navbar.links); setHomeData(home); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      {/* Navbar Links */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Navbar Links</h2>
          <button onClick={addLink} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Link</button>
        </div>
        <div className="space-y-3">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-3 border border-neutral-100 rounded-lg p-3">
              <input value={link.label} onChange={e => updateLink(link.id, 'label', e.target.value)} className="w-40 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="Label" />
              <input value={link.href} onChange={e => updateLink(link.id, 'href', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg" placeholder="Href" />
              <button onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Home Section Headers */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Home Page Section Headers</h2>
        <div className="space-y-4">
          {(['featuredSection', 'popularSection', 'recentlyViewedSection'] as const).map(key => {
            const section = homeData[key];
            return (
              <div key={key} className="border border-neutral-100 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold capitalize">{key.replace('Section', '')} Section</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Tagline</label>
                    <input value={section.tagline} onChange={e => setHomeData({ ...homeData, [key]: { ...section, tagline: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
                  <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Title</label>
                    <input value={section.title} onChange={e => setHomeData({ ...homeData, [key]: { ...section, title: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
                </div>
              </div>
            );
          })}

          {/* Why Choose Us */}
          <div className="border border-neutral-100 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Why Choose Us</h3>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Title</label>
              <input value={homeData.whyChooseUs.title} onChange={e => setHomeData({ ...homeData, whyChooseUs: { ...homeData.whyChooseUs, title: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Description</label>
              <textarea value={homeData.whyChooseUs.description} onChange={e => setHomeData({ ...homeData, whyChooseUs: { ...homeData.whyChooseUs, description: e.target.value } })} rows={2} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none resize-none" /></div>
          </div>

          {/* Contact CTA */}
          <div className="border border-neutral-100 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Contact CTA</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Title</label>
                <input value={homeData.contactCTA.title} onChange={e => setHomeData({ ...homeData, contactCTA: { ...homeData.contactCTA, title: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
              <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Subtitle</label>
                <input value={homeData.contactCTA.subtitle} onChange={e => setHomeData({ ...homeData, contactCTA: { ...homeData.contactCTA, subtitle: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
              <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">CTA Text</label>
                <input value={homeData.contactCTA.ctaText} onChange={e => setHomeData({ ...homeData, contactCTA: { ...homeData.contactCTA, ctaText: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
              <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">CTA Link</label>
                <input value={homeData.contactCTA.ctaLink} onChange={e => setHomeData({ ...homeData, contactCTA: { ...homeData.contactCTA, ctaLink: e.target.value } })} className="w-full mt-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:border-blue-400 outline-none" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

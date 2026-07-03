import { useState } from 'react';
import { useCMSStore, type BlogPost } from '../store/useCMSStore';
import { Plus, Trash2, Save, RotateCcw, ExternalLink, X, Pencil } from 'lucide-react';
import { FileUpload } from '../components/ui/FileUpload';

type ModalState = { mode: 'add' } | { mode: 'edit'; id: string } | null;

function BlogModal({ post, categories, onSave, onClose }: { post: BlogPost | null; categories: string[]; onSave: (p: BlogPost) => void; onClose: () => void }) {
  const [form, setForm] = useState<BlogPost>(post || {
    id: `bp${Date.now()}`, slug: 'new-post', title: '', excerpt: '', category: categories[0] || 'Travel',
    date: new Date().toISOString().split('T')[0], readTime: '5 min', image: '', content: '',
  });
  const u = (f: keyof BlogPost, v: string) => setForm({ ...form, [f]: v });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold">{post ? 'Edit Post' : 'New Post'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Title</label><input value={form.title} onChange={e => u('title', e.target.value)} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none" placeholder="Blog post title" /></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Slug</label><input value={form.slug} onChange={e => u('slug', e.target.value)} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none" /></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Category</label><select value={form.category} onChange={e => u('category', e.target.value)} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none bg-white">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Date</label><input type="date" value={form.date} onChange={e => u('date', e.target.value)} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none" /></div>
            <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Read Time</label><input value={form.readTime} onChange={e => u('readTime', e.target.value)} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none" placeholder="5 min" /></div>
          </div>
          <FileUpload value={form.image} onChange={url => u('image', url)} label="Featured Image" folder="images" />
          <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Excerpt</label><textarea value={form.excerpt} onChange={e => u('excerpt', e.target.value)} rows={2} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none resize-none" placeholder="Short description..." /></div>
          <div><label className="text-[10px] text-neutral-400 uppercase tracking-wider">Full Content</label><textarea value={form.content} onChange={e => u('content', e.target.value)} rows={8} className="w-full mt-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none resize-none" placeholder="Write your blog post content here..." /></div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-neutral-200 rounded-xl hover:bg-neutral-50">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"><Save size={14} /> {post ? 'Update' : 'Create'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const { blog, updateBlog } = useCMSStore();
  const [posts, setPosts] = useState<BlogPost[]>(blog.posts);
  const [categories, setCategories] = useState<string[]>(blog.categories);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [catInput, setCatInput] = useState('');

  const handleSave = () => { updateBlog({ posts, categories }); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const addPost = (p: BlogPost) => setPosts([...posts, p]);
  const updatePost = (p: BlogPost) => setPosts(posts.map(existing => existing.id === p.id ? p : existing));
  const removePost = (id: string) => setPosts(posts.filter(p => p.id !== id));
  const addCategory = () => { if (catInput.trim()) { setCategories([...categories, catInput.trim()]); setCatInput(''); } };
  const removeCategory = (i: number) => setCategories(categories.filter((_, idx) => idx !== i));
  const editingPost = modal?.mode === 'edit' ? posts.find(p => p.id === modal.id) || null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Blog</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage blog posts and categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setPosts(blog.posts); setCategories(blog.categories); }} className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}><Save size={14} /> {saved ? 'Saved!' : 'Save'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-sm">
              <span>{cat}</span>
              <button onClick={() => removeCategory(i)} className="text-neutral-400 hover:text-red-500 text-xs">&times;</button>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <input value={catInput} onChange={e => setCatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCategory()} className="px-3 py-1.5 text-sm border border-neutral-200 rounded-full w-32 focus:border-blue-400 outline-none" placeholder="New category" />
            <button onClick={addCategory} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100"><Plus size={12} /> Add</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Posts ({posts.length})</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14} /> Add Post</button>
        </div>
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-3 border border-neutral-100 rounded-xl p-3 hover:bg-neutral-50 transition-colors">
              {post.image && <img src={post.image} alt="" className="w-20 h-14 object-cover rounded-lg" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-xs text-neutral-400">{post.category} &middot; {post.date} &middot; {post.readTime}</p>
              </div>
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><ExternalLink size={14} /></a>
              <button onClick={() => setModal({ mode: 'edit', id: post.id })} className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => removePost(post.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">No posts yet.</p>}
        </div>
      </div>

      {modal?.mode === 'add' && <BlogModal post={null} categories={categories} onSave={addPost} onClose={() => setModal(null)} />}
      {modal?.mode === 'edit' && <BlogModal post={editingPost} categories={categories} onSave={updatePost} onClose={() => setModal(null)} />}
    </div>
  );
}

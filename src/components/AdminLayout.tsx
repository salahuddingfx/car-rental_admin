import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Users, BarChart3, Settings, Shield, ChevronRight, Image, Tag, Star, HelpCircle, Gift, BookOpen, MessageSquare, MessageCircle, Calendar, FileText, PenTool, Navigation, Clock, ChevronDown, LogOut, CreditCard, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from '../store/useAdminAuth';

const mainLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/cars', label: 'All Cars', icon: Car },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/chats', label: 'Live Chat', icon: MessageCircle },
  { to: '/admin/review-links', label: 'Review Links', icon: ExternalLink },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const contentLinks = [
  { to: '/admin/hero', label: 'Hero Section', icon: Image },
  { to: '/admin/navbar', label: 'Navbar & Home', icon: Navigation },
  { to: '/admin/brands', label: 'Brands', icon: Tag },
  { to: '/admin/features', label: 'Features & Stats', icon: Star },
  { to: '/admin/offers', label: 'Offers', icon: Gift },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/about', label: 'About Page', icon: BookOpen },
  { to: '/admin/contact', label: 'Contact Page', icon: MessageSquare },
  { to: '/admin/timeline', label: 'Timeline', icon: Clock },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/blog', label: 'Blog', icon: PenTool },
  { to: '/admin/footer', label: 'Footer', icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [contentOpen, setContentOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-neutral-100">
          <Link to="/" className="font-display font-bold text-lg tracking-widest flex items-center gap-1.5">
            <span className="text-amber-500 font-extrabold text-xl">A</span>pex Ride
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={12} className="text-blue-600" />
            <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest px-3 mb-2">Dashboard</p>
          {mainLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/admin' && location.pathname.startsWith(link.to));
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'}`}>
                <link.icon size={18} />
                <span className="font-display text-xs tracking-wider uppercase">{link.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}

          <div className="pt-4 pb-2">
            <button onClick={() => setContentOpen(!contentOpen)}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-xl transition-all">
              <FileText size={18} />
              <span className="font-display text-xs tracking-wider uppercase flex-1 text-left">Content CMS</span>
              <ChevronDown size={14} className={`transition-transform ${contentOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {contentOpen && contentLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ml-2 ${isActive ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'}`}>
                <link.icon size={16} />
                <span className="font-display text-xs tracking-wider uppercase">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-xl transition-colors mb-2">
            ← Back to Client Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors w-full mb-2">
            <LogOut size={14} /> Sign Out
          </button>
          <div className="flex items-center gap-3 px-3 py-2 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield size={14} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-800 truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] text-neutral-400 capitalize">{admin?.role?.replace('_', ' ') || 'Super Admin'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}

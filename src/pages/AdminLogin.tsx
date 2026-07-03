import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../store/useAdminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wider">
            <span className="text-amber-400">A</span>pex Ride
          </h1>
          <p className="text-xs text-neutral-400 font-display uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-xs text-neutral-400">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Email</label>
              <div className="flex items-center border border-white/10 p-3 bg-white/5 rounded-xl focus-within:border-blue-500 transition-colors">
                <Mail size={16} className="text-neutral-500 mr-2" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com"
                  className="bg-transparent text-sm text-white placeholder-neutral-500 outline-none w-full" required />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1.5 block">Password</label>
              <div className="flex items-center border border-white/10 p-3 bg-white/5 rounded-xl focus-within:border-blue-500 transition-colors">
                <Lock size={16} className="text-neutral-500 mr-2" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                  className="bg-transparent text-sm text-white placeholder-neutral-500 outline-none w-full" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-neutral-500 hover:text-neutral-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>


        </div>

        <p className="text-center text-[10px] text-neutral-600 mt-6">
          &copy; {new Date().getFullYear()} Apex Ride. Admin access only.
        </p>
      </div>
    </div>
  );
}

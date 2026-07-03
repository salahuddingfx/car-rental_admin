import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Save, CheckCircle, XCircle } from 'lucide-react';
import { usersApi, type AdminUser } from '../lib/api';
import { Modal } from '../components/ui/Modal';

const ROLES = [
  { value: 'user', label: 'User (Client)', color: 'bg-blue-50 text-blue-600' },
  { value: 'driver', label: 'Driver', color: 'bg-green-50 text-green-600' },
  { value: 'host', label: 'Host', color: 'bg-purple-50 text-purple-600' },
  { value: 'company', label: 'Company', color: 'bg-amber-50 text-amber-600' },
  { value: 'admin', label: 'Admin', color: 'bg-red-50 text-red-600' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [licenseUser, setLicenseUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<AdminUser['role']>('user');
  const [editBalance, setEditBalance] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersApi.list();
      setUsers(res.data);
    } catch (e) {
      console.error('Failed to load users:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      await usersApi.update(String(editUser.id), {
        role: editRole,
        balance: editBalance,
      });
      setUsers(prev => prev.map(u =>
        u.id === editUser.id ? { ...u, role: editRole, balance: editBalance } : u
      ));
      setEditUser(null);
    } catch (e) {
      console.error('Failed to update user:', e);
    }
    setSaving(false);
  };

  const getRoleBadge = (role: string) => {
    const found = ROLES.find(r => r.value === role);
    return found || ROLES[0];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          Refresh
        </button>
      </div>

      <div className="bg-white border border-neutral-200/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">User</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Role</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Balance</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">License</th>
                <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const badge = getRoleBadge(user.role);
                return (
                  <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users size={16} className="text-neutral-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">{user.name}</p>
                          <p className="text-[10px] text-neutral-500 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                          {user.phone && <p className="text-[10px] text-neutral-400 flex items-center gap-1"><Phone size={10} /> {user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-1 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-neutral-700">৳{Number(user.balance).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setLicenseUser(user)} className="cursor-pointer">
                        {user.license_verified ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Verified</span>
                        ) : user.license_number ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                        ) : (
                          <span className="text-[10px] text-neutral-400">None</span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => { setEditUser(user); setEditRole(user.role); setEditBalance(String(user.balance)); }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-neutral-400 text-sm">No users found</td></tr>
              )}
              {loading && (
                <tr><td colSpan={5} className="text-center py-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <Modal title="Edit User Role" onClose={() => setEditUser(null)}>
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-sm font-bold text-neutral-800">{editUser.name}</p>
                <p className="text-xs text-neutral-500">{editUser.email}</p>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-2 block">Assign Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => setEditRole(role.value as AdminUser['role'])}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        editRole === role.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-neutral-800">{role.label}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {role.value === 'user' && 'Can browse & book cars'}
                        {role.value === 'driver' && 'Can list cars for rent'}
                        {role.value === 'host' && 'Manages fleet vehicles'}
                        {role.value === 'company' && 'Business account'}
                        {role.value === 'admin' && 'Full system access'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-2 block">Balance (৳)</label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={e => setEditBalance(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)}
                  className="flex-1 py-2.5 border border-neutral-200 text-sm font-bold text-neutral-600 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
        </Modal>
      )}

      {/* License Detail Modal */}
      {licenseUser && (
        <Modal title="License Details" onClose={() => setLicenseUser(null)}>
          <div className="space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-sm font-bold text-neutral-800">{licenseUser.name}</p>
              <p className="text-xs text-neutral-500">{licenseUser.email}</p>
            </div>

            {licenseUser.license_image && (
              <div>
                <label className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-2 block">License Photo</label>
                <img src={licenseUser.license_image} alt="License" className="w-full max-h-60 object-contain rounded-xl border border-neutral-200" />
              </div>
            )}

            <div className="space-y-2">
              {licenseUser.license_number && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">License Number</span>
                  <span className="font-mono font-bold text-neutral-800">{licenseUser.license_number}</span>
                </div>
              )}
              {licenseUser.license_expiry && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Expiry</span>
                  <span className="text-neutral-800">{licenseUser.license_expiry}</span>
                </div>
              )}
              {licenseUser.license_country && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Country</span>
                  <span className="text-neutral-800">{licenseUser.license_country}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Status</span>
                <span className={`font-bold ${licenseUser.license_verified ? 'text-green-600' : 'text-amber-600'}`}>
                  {licenseUser.license_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            {!licenseUser.license_verified && licenseUser.license_number && (
              <div className="flex gap-3 pt-2">
                <button onClick={async () => {
                  try {
                    const { api } = await import('../lib/api');
                    await api.put(`/admin/users/${licenseUser.id}`, { license_verified: true });
                    setUsers(prev => prev.map(u => u.id === licenseUser.id ? { ...u, license_verified: true } : u));
                    setLicenseUser(null);
                  } catch { alert('Failed to verify'); }
                }} className="flex-1 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer">
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={async () => {
                  try {
                    const { api } = await import('../lib/api');
                    await api.put(`/admin/users/${licenseUser.id}`, { license_number: null, license_expiry: null, license_country: null, license_image: null, license_verified: false });
                    setUsers(prev => prev.map(u => u.id === licenseUser.id ? { ...u, license_number: undefined, license_expiry: undefined, license_country: undefined, license_image: undefined, license_verified: false } : u));
                    setLicenseUser(null);
                  } catch { alert('Failed to reject'); }
                }} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

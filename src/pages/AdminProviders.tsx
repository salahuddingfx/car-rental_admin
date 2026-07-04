import { useState, useEffect } from 'react';
import { providersApi } from '../../lib/api';
import { Shield, ShieldCheck, ShieldAlert, Eye, CheckCircle, XCircle, Users, Car } from 'lucide-react';

interface Provider {
  id: number;
  name: string;
  type: string;
  verification_status: string;
  is_active: boolean;
  rating: number;
  total_cars: number;
  total_bookings: number;
  created_at: string;
  user: { id: number; name: string; email: string };
}

export default function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      if (tab === 'pending') {
        const data = await providersApi.pending(page);
        setProviders(data.data);
        setLastPage(data.last_page);
      } else {
        const data = await providersApi.list({ page, search: search || undefined });
        setProviders(data.data);
        setLastPage(data.last_page);
      }
    } catch {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [tab, page, search]);

  const handleVerify = async (id: string, status: string, reason?: string) => {
    try {
      await providersApi.verify(id, { status, rejection_reason: reason });
      fetchProviders();
    } catch (err: any) {
      alert(err.message || 'Failed to update');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await providersApi.toggleStatus(id);
      fetchProviders();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const statusBadge = (status: string) => {
    const styles = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => { setTab('all'); setPage(1); }}
          className={`pb-3 px-1 text-sm font-medium border-b-2 ${tab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          All Providers
        </button>
        <button
          onClick={() => { setTab('pending'); setPage(1); }}
          className={`pb-3 px-1 text-sm font-medium border-b-2 ${tab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          Pending Verification
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : providers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No providers found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm capitalize">{provider.type}</span>
                  </td>
                  <td className="px-6 py-4">{statusBadge(provider.verification_status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {provider.total_cars}</span>
                      <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {provider.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {provider.verification_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(provider.id.toString(), 'verified')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Verify"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) handleVerify(provider.id.toString(), 'rejected', reason);
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleToggleStatus(provider.id.toString())}
                        className={`p-1 rounded ${provider.is_active ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={provider.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {lastPage}</span>
              <button
                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="text-sm text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

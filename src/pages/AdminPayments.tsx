import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CreditCard } from 'lucide-react';
import { api } from '../lib/api';

interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  amount: string;
  currency: string;
  method: string;
  status: string;
  transaction_id: string | null;
  sender_number: string | null;
  admin_note: string | null;
  paid_at: string | null;
  verified_at: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string };
  booking?: { id: number; booking_ref: string; total_price: string; car?: { name: string; brand: string } };
}

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'pending' ? '/admin/payments/pending' : '/admin/payments/all';
      const res = await api.get<{ data: Payment[]; current_page: number; last_page: number }>(endpoint);
      const items = res?.data || [];
      setPayments(filter === 'all' ? items : items.filter((p: Payment) => p.status === filter));
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [filter]);

  const handleVerify = async (paymentId: number, status: 'completed' | 'failed') => {
    setProcessing(true);
    try {
      await api.put(`/admin/payments/${paymentId}/verify`, { status, admin_note: adminNote || null });
      setSelectedPayment(null);
      setAdminNote('');
      fetchPayments();
    } catch {
      alert('Failed to update payment');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getMethodIcon = (method: string) => {
    if (method === 'bkash') return <span className="text-lg">🟣</span>;
    if (method === 'nagad') return <span className="text-lg">🟠</span>;
    return <CreditCard size={16} className="text-neutral-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payments</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Verify bKash/Nagad payments</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-2">
        {(['pending', 'all', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-accent-blue text-white'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Payment list */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">No payments found</div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMethodIcon(payment.method)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {payment.user?.name || `User #${payment.user_id}`}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <p className="text-xs text-neutral-400">
                      {payment.method.toUpperCase()} · TXN: {payment.transaction_id || 'N/A'} · {payment.sender_number || 'N/A'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Booking: {payment.booking?.booking_ref || `#${payment.booking_id}`} · {payment.booking?.car?.name || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">
                    ৳{Number(payment.amount).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-neutral-400">{new Date(payment.created_at).toLocaleString()}</p>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="mt-2 text-xs text-accent-blue hover:underline"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Review Payment</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount</span>
                <span className="font-bold text-neutral-900 dark:text-white">৳{Number(selectedPayment.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Method</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">{selectedPayment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedPayment.transaction_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Sender Number</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">{selectedPayment.sender_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">User</span>
                <span className="text-neutral-800 dark:text-neutral-200">{selectedPayment.user?.name} ({selectedPayment.user?.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Booking</span>
                <span className="text-neutral-800 dark:text-neutral-200">{selectedPayment.booking?.booking_ref}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-neutral-400 mb-1 block">Admin Note (optional)</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none"
                rows={2}
                placeholder="Add a note..."
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setSelectedPayment(null); setAdminNote(''); }}
                className="flex-1 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleVerify(selectedPayment.id, 'failed')}
                disabled={processing}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <X size={14} className="inline mr-1" /> Reject
              </button>
              <button
                onClick={() => handleVerify(selectedPayment.id, 'completed')}
                disabled={processing}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent-blue rounded-lg hover:bg-accent-blue-hover disabled:opacity-50 transition-colors"
              >
                <Check size={14} className="inline mr-1" /> Approve
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

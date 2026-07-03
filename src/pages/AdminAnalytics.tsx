import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { TrendingUp, DollarSign, Car, Calendar, BarChart3, PieChart, Activity, Globe, Monitor, Smartphone, AlertTriangle, Clock, Users, Eye, MousePointerClick, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

interface BusinessStats {
  total_users: number;
  total_cars: number;
  total_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  monthly_revenue: { month: string; revenue: number; count: number }[];
  bookings_by_status: Record<string, number>;
  categories: { category: string; count: number; total_price: number }[];
  top_cars: any[];
  recent_bookings: any[];
}

interface TrafficStats {
  period_days: number;
  summary: {
    total_requests: number;
    total_page_views: number;
    total_errors: number;
    unique_visitors: number;
    unique_users: number;
    avg_response_time_ms: number;
    error_rate: number;
  };
  today: {
    requests: number;
    page_views: number;
    errors: number;
    unique_visitors: number;
  };
  requests_per_day: { date: string; requests: number; errors: number }[];
  top_pages: { path: string; views: number; unique_visitors: number }[];
  top_endpoints: { endpoint: string; hits: number; avg_time: number }[];
  devices: { device_type: string; count: number }[];
  browsers: { browser: string; count: number }[];
  operating_systems: { os: string; count: number }[];
  hourly_traffic: { hour: number; requests: number }[];
  error_paths: { path: string; status_code: number; count: number }[];
  slow_requests: { path: string; method: string; avg_time: number; count: number }[];
  daily_active_users: { date: string; active_users: number }[];
  top_referrers: { referer: string; count: number }[];
  platform: {
    total_users: number;
    total_cars: number;
    total_bookings: number;
    total_revenue: number;
  };
}

type Tab = 'overview' | 'traffic' | 'endpoints' | 'errors';

export default function AdminAnalytics() {
  const [businessStats, setBusinessStats] = useState<BusinessStats | null>(null);
  const [trafficStats, setTrafficStats] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [biz, traffic] = await Promise.allSettled([
          api.get<BusinessStats>('/admin/stats'),
          api.get<TrafficStats>(`/admin/analytics/overview?days=${period}`),
        ]);
        if (biz.status === 'fulfilled') setBusinessStats(biz.value);
        if (traffic.status === 'fulfilled') setTrafficStats(traffic.value);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusData = businessStats ? Object.entries(businessStats.bookings_by_status).map(([name, value]) => ({ name, value })) : [];
  const categoryData = businessStats?.categories.map(c => ({ name: c.category, cars: c.count, revenue: Number(c.total_price) || 0 })) || [];
  const deviceData = trafficStats?.devices.map(d => ({ name: d.device_type || 'Unknown', value: d.count })) || [];
  const browserData = trafficStats?.browsers.map(b => ({ name: b.browser || 'Unknown', value: b.count })) || [];
  const osData = trafficStats?.operating_systems.map(o => ({ name: o.os || 'Unknown', value: o.count })) || [];

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'traffic', label: 'Traffic', icon: Activity },
    { id: 'endpoints', label: 'Endpoints', icon: Zap },
    { id: 'errors', label: 'Errors', icon: AlertTriangle },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1">Platform performance & traffic insights</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                period === d ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}>{d}d</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* ========== OVERVIEW TAB ========== */}
      {activeTab === 'overview' && (
        <>
          {/* Business KPIs */}
          {businessStats && (
            <>
              <h3 className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-3">Business Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Revenue', value: `৳${businessStats.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Total Bookings', value: businessStats.total_bookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Avg. Booking', value: `৳${businessStats.avg_booking_value.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Cars Listed', value: businessStats.total_cars, icon: Car, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                      <s.icon size={20} className={s.color} />
                    </div>
                    <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">{s.label}</p>
                    <span className="text-xl font-bold text-neutral-900 font-display">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Traffic KPIs */}
          {trafficStats && (
            <>
              <h3 className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-3">Traffic ({period} days)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Requests', value: trafficStats.summary.total_requests.toLocaleString(), icon: MousePointerClick, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Unique Visitors', value: trafficStats.summary.unique_visitors.toLocaleString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Avg Response', value: `${trafficStats.summary.avg_response_time_ms}ms`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Error Rate', value: `${trafficStats.summary.error_rate}%`, icon: AlertTriangle, color: trafficStats.summary.error_rate > 5 ? 'text-red-600' : 'text-green-600', bg: trafficStats.summary.error_rate > 5 ? 'bg-red-50' : 'bg-green-50' },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                      <s.icon size={20} className={s.color} />
                    </div>
                    <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">{s.label}</p>
                    <span className="text-xl font-bold text-neutral-900 font-display">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Today's snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                  <p className="text-[10px] text-blue-400 font-display uppercase tracking-widest mb-1">Today — Requests</p>
                  <span className="text-lg font-bold text-blue-700">{trafficStats.today.requests}</span>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                  <p className="text-[10px] text-green-400 font-display uppercase tracking-widest mb-1">Today — Visitors</p>
                  <span className="text-lg font-bold text-green-700">{trafficStats.today.unique_visitors}</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl">
                  <p className="text-[10px] text-purple-400 font-display uppercase tracking-widest mb-1">Today — Page Views</p>
                  <span className="text-lg font-bold text-purple-700">{trafficStats.today.page_views}</span>
                </div>
                <div className={`p-4 rounded-2xl ${trafficStats.today.errors > 10 ? 'bg-red-50 border border-red-100' : 'bg-neutral-50 border border-neutral-100'}`}>
                  <p className={`text-[10px] font-display uppercase tracking-widest mb-1 ${trafficStats.today.errors > 10 ? 'text-red-400' : 'text-neutral-400'}`}>Today — Errors</p>
                  <span className={`text-lg font-bold ${trafficStats.today.errors > 10 ? 'text-red-700' : 'text-neutral-700'}`}>{trafficStats.today.errors}</span>
                </div>
              </div>
            </>
          )}

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Requests over time */}
            {trafficStats && trafficStats.requests_per_day.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-blue-600" /> Requests Per Day
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={trafficStats.requests_per_day}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip labelFormatter={v => new Date(v).toLocaleDateString()} />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f620" name="Requests" />
                    <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef444420" name="Errors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Monthly Revenue */}
            {businessStats && businessStats.monthly_revenue.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BarChart3 size={14} className="text-green-600" /> Monthly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={businessStats.monthly_revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Second row: pie charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Devices */}
            {deviceData.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Monitor size={14} className="text-purple-600" /> Devices
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                      {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Browsers */}
            {browserData.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe size={14} className="text-blue-600" /> Browsers
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie data={browserData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                      {browserData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* OS */}
            {osData.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Smartphone size={14} className="text-amber-600" /> Operating Systems
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie data={osData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                      {osData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bookings by Status + Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {statusData.some(d => d.value > 0) && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PieChart size={14} className="text-purple-600" /> Bookings by Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
            {categoryData.length > 0 && (
              <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
                <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4">Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Daily active users */}
          {trafficStats && trafficStats.daily_active_users.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users size={14} className="text-green-600" /> Daily Active Users
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trafficStats.daily_active_users}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip labelFormatter={v => new Date(v).toLocaleDateString()} />
                  <Line type="monotone" dataKey="active_users" stroke="#10b981" strokeWidth={2} dot={false} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* ========== TRAFFIC TAB ========== */}
      {activeTab === 'traffic' && trafficStats && (
        <>
          {/* Hourly traffic (last 24h) */}
          {trafficStats.hourly_traffic.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} className="text-blue-600" /> Hourly Traffic (Last 24h)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trafficStats.hourly_traffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickFormatter={h => `${h}:00`} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [v, 'Requests']} labelFormatter={h => `${h}:00`} />
                  <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top pages */}
          {trafficStats.top_pages.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Eye size={14} className="text-purple-600" /> Top Pages
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Page</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Views</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficStats.top_pages.map((p, i) => (
                      <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-neutral-700">{p.path}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs font-bold text-neutral-800">{p.views.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs text-neutral-500">{p.unique_visitors.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top referrers */}
          {trafficStats.top_referrers.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe size={14} className="text-amber-600" /> Top Referrers
              </h3>
              <div className="space-y-2">
                {trafficStats.top_referrers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <span className="text-xs font-mono text-neutral-600 truncate max-w-[70%]">{r.referer}</span>
                    <span className="text-xs font-bold text-neutral-800">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========== ENDPOINTS TAB ========== */}
      {activeTab === 'endpoints' && trafficStats && (
        <>
          {trafficStats.top_endpoints.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} className="text-blue-600" /> Most Hit Endpoints
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Endpoint</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Hits</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficStats.top_endpoints.map((e, i) => (
                      <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-neutral-700">{e.endpoint}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs font-bold text-neutral-800">{e.hits.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`text-xs font-bold ${e.avg_time > 500 ? 'text-red-500' : e.avg_time > 200 ? 'text-amber-500' : 'text-green-600'}`}>
                            {Math.round(e.avg_time)}ms
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Slow requests */}
          {trafficStats.slow_requests.length > 0 && (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} className="text-red-500" /> Slowest Endpoints (&gt;1s)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Endpoint</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Calls</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficStats.slow_requests.map((r, i) => (
                      <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mr-2">{r.method}</span>
                          <span className="text-xs font-mono text-neutral-700">{r.path}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs text-neutral-500">{r.count}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs font-bold text-red-500">{Math.round(r.avg_time)}ms</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========== ERRORS TAB ========== */}
      {activeTab === 'errors' && trafficStats && (
        <>
          {/* Error summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
              <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">Total Errors ({period}d)</p>
              <span className="text-2xl font-bold text-red-600">{trafficStats.summary.total_errors}</span>
            </div>
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
              <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">Error Rate</p>
              <span className={`text-2xl font-bold ${trafficStats.summary.error_rate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                {trafficStats.summary.error_rate}%
              </span>
            </div>
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl">
              <p className="text-[10px] text-neutral-400 font-display uppercase tracking-widest mb-1">Today's Errors</p>
              <span className="text-2xl font-bold text-neutral-800">{trafficStats.today.errors}</span>
            </div>
          </div>

          {/* Error paths table */}
          {trafficStats.error_paths.length > 0 ? (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-5 rounded-2xl mb-6">
              <h3 className="font-display text-xs font-bold text-neutral-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" /> Error Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Path</th>
                      <th className="text-center text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Status</th>
                      <th className="text-right text-[10px] font-display font-bold text-neutral-400 uppercase tracking-widest px-4 py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficStats.error_paths.map((e, i) => (
                      <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-neutral-700">{e.path}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            e.status_code >= 500 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>{e.status_code}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-xs font-bold text-neutral-800">{e.count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200/60 shadow-sm p-8 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity size={24} className="text-green-500" />
              </div>
              <p className="text-sm font-bold text-neutral-800">No Errors Found</p>
              <p className="text-xs text-neutral-500 mt-1">Platform is running smoothly in the last {period} days</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { analyticsData } from '../../data/mock';
import { formatPrice } from '../../lib/utils';
import { Clock, TrendingUp, Store, Truck, Calendar } from 'lucide-react';

const hourlyData = [
  { hour: '11 AM', orders: 8 },
  { hour: '12 PM', orders: 24 },
  { hour: '1 PM', orders: 42 },
  { hour: '2 PM', orders: 30 },
  { hour: '3 PM', orders: 12 },
  { hour: '6 PM', orders: 18 },
  { hour: '7 PM', orders: 36 },
  { hour: '8 PM', orders: 58 },
  { hour: '9 PM', orders: 45 },
  { hour: '10 PM', orders: 20 },
];

export default function PartnerAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-xs text-slate-500">Order patterns, peak rush timings, and QuickPick efficiency</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-btn border border-gray-200 text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last 7 Days (Sep 20 - Sep 26)</span>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total QuickPick Orders</span>
            <Store className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">224</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">48% of total volume</p>
        </div>

        <div className="card p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Pickup Wait Time</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">1.8 min</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Queue-free target achieved</p>
        </div>

        <div className="card p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Weekly Total Gross</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">₹1,96,000</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+14.2% week-on-week</p>
        </div>
      </div>

      {/* Comparison: Delivery vs QuickPick Volume */}
      <div className="card p-5 bg-white border border-gray-200">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900">Fulfillment Mode Comparison</h2>
          <p className="text-xs text-slate-500">Daily QuickPick Pickup vs Home Delivery orders</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="pickup" name="QuickPick (Pickup)" fill="#E64A2E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivery" name="Delivery" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Kitchen Rush Hours */}
      <div className="card p-5 bg-white border border-gray-200">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900">Peak Kitchen Rush Hours</h2>
          <p className="text-xs text-slate-500">Order concentration throughout the day</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorHour" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Orders Placed"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#colorHour)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

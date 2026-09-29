import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Store,
  ArrowUpRight,
  AlertCircle,
  Plus,
  Play,
  Pause,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { analyticsData, sampleOrders, menuItems } from '../../data/mock';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice } from '../../lib/utils';
import { useUIStore } from '../../store';

export default function PartnerDashboardPage() {
  const { addNotification } = useUIStore();
  const [prepTimeBuffer, setPrepTimeBuffer] = useState(15);

  const kpis = [
    {
      title: "Today's Orders",
      value: '64',
      change: '+14% vs yesterday',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: "Today's Revenue",
      value: '₹28,450',
      change: '+8.2% vs last week',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Active in Kitchen',
      value: '4 orders',
      change: '3 QuickPick, 1 Delivery',
      trend: 'neutral',
      icon: Store,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      title: 'Avg Prep Time',
      value: '14 min',
      change: '-2 min faster than avg',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const handleUpdatePrepTime = (change: number) => {
    const newVal = Math.max(5, prepTimeBuffer + change);
    setPrepTimeBuffer(newVal);
    addNotification({
      type: 'info',
      title: `Estimated preparation time updated to ${newVal} mins`,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Outlet Dashboard</h1>
          <p className="text-xs text-slate-500">Live operational telemetry and kitchen throughput</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/partner/menu" className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </Link>
          <Link to="/partner/orders" className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5">
            <span>View Live Orders (4)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="card p-4 sm:p-5 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                {kpi.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-600" />}
                <span>{kpi.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Current Queue Status & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* QuickPick Queue Widget */}
        <div className="lg:col-span-8 card p-5 bg-white border border-gray-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                Live QuickPick Counter Status
              </h2>
              <p className="text-xs text-slate-500">Real-time queue monitoring at Counter 2</p>
            </div>
            <span className="badge-brand text-xs font-semibold">Counter 2 Terminal</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
              <p className="text-xl font-bold text-amber-900">3</p>
              <p className="text-[11px] font-semibold text-amber-700">Currently Cooking</p>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
              <p className="text-xl font-bold text-emerald-900">1</p>
              <p className="text-[11px] font-semibold text-emerald-700">Ready at Counter</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xl font-bold text-slate-700">0</p>
              <p className="text-[11px] font-semibold text-slate-500">Delayed / Held</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>Current Prep Buffer: <strong className="text-slate-900">{prepTimeBuffer} mins</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdatePrepTime(-5)}
                className="px-2 py-1 bg-white border border-gray-200 rounded text-slate-700 font-bold hover:bg-gray-50"
              >
                -5m
              </button>
              <button
                onClick={() => handleUpdatePrepTime(5)}
                className="px-2 py-1 bg-white border border-gray-200 rounded text-slate-700 font-bold hover:bg-gray-50"
              >
                +5m
              </button>
            </div>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="lg:col-span-4 card p-5 bg-white border border-gray-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-gray-100">
            Outlet Controls
          </h2>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => addNotification({ type: 'warning', title: 'Outlet set to 15-minute rush buffer' })}
              className="w-full text-left p-2.5 rounded-btn border border-gray-200 hover:border-brand-400 hover:bg-brand-50/20 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-slate-800">Peak Rush Mode</p>
                <p className="text-[11px] text-slate-500">Automatically adds +10m prep time</p>
              </div>
              <Play className="w-3.5 h-3.5 text-brand-600" />
            </button>

            <button
              onClick={() => addNotification({ type: 'info', title: 'Printed Daily Kitchen Report' })}
              className="w-full text-left p-2.5 rounded-btn border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-slate-800">Print KOT Summary</p>
                <p className="text-[11px] text-slate-500">Daily kitchen ticket report</p>
              </div>
              <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Revenue & Hourly Trend Chart (Recharts) */}
      <div className="card p-5 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Weekly Sales & Volume</h2>
            <p className="text-xs text-slate-500">Daily breakdown of revenue (₹) and orders</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              Revenue (₹)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              QuickPick Orders
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E64A2E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E64A2E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPick" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#E64A2E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
              <Area
                type="monotone"
                dataKey="pickup"
                name="QuickPick Orders"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPick)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables: Popular Items & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Dishes */}
        <div className="card p-5 bg-white border border-gray-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Top Selling Dishes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2">Dish</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Prep Time</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {menuItems.slice(0, 5).map((item) => (
                  <tr key={item.id} className="py-2 hover:bg-gray-50">
                    <td className="py-2.5 font-medium flex items-center gap-1.5">
                      <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
                      <span className="truncate max-w-[140px]">{item.name}</span>
                    </td>
                    <td className="py-2.5">{formatPrice(item.price)}</td>
                    <td className="py-2.5">{item.prepTime} min</td>
                    <td className="py-2.5 text-right">
                      <span className="badge-success text-[10px]">Available</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Kitchen Orders */}
        <div className="card p-5 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Recent Kitchen Orders</h2>
            <Link to="/partner/orders" className="text-xs text-brand-600 font-medium hover:underline">
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {sampleOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:border-gray-200 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{ord.orderNumber}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium uppercase">
                      {ord.fulfillmentType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ready by: {ord.estimatedTime} · {formatPrice(ord.total)}
                  </p>
                </div>
                <StatusBadge status={ord.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

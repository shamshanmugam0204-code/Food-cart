import { Store, ShoppingBag, Users, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { analyticsData, restaurants, sampleOrders } from '../../data/mock';
import { formatPrice } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Platform GMV (MTD)', value: '₹14,82,500', change: '+18.4%', icon: DollarSign },
    { title: 'Active Outlets', value: '48 Outlets', change: '8 QuickPick Hubs', icon: Store },
    { title: 'Daily Order Volume', value: '1,420 orders', change: '+12.1%', icon: ShoppingBag },
    { title: 'Registered Users', value: '18,940', change: '+340 this week', icon: Users },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-xs text-slate-500">Platform-wide metrics, restaurant health, and order monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="card p-5 bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{s.title}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>{s.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* GMV Growth Chart */}
      <div className="card p-5 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">City-Wide Order Run-rate</h2>
            <p className="text-xs text-slate-500">Bengaluru Region (Koramangala, Indiranagar, HSR Layout)</p>
          </div>
        </div>

        <div className="h-64 w-full">
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
              <Bar dataKey="revenue" name="Total GMV (₹)" fill="#E64A2E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live System Orders */}
      <div className="card p-5 bg-white border border-gray-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Recent Platform Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Restaurant</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {sampleOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{o.orderNumber}</td>
                  <td className="py-2.5 px-3">{o.restaurant.name}</td>
                  <td className="py-2.5 px-3 capitalize">
                    <span className={o.fulfillmentType === 'pickup' ? 'badge-brand' : 'badge-info'}>
                      {o.fulfillmentType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="py-2.5 px-3 uppercase text-[11px] text-slate-500">
                    {o.paymentMethod}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

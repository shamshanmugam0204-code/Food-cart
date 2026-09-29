import { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { sampleOrders } from '../../data/mock';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPrice, formatDateTime } from '../../lib/utils';
import type { Order } from '../../types';

export default function AdminOrdersPage() {
  const [orders] = useState<Order[]>(sampleOrders);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchesType = filterType === 'all' || o.fulfillmentType === filterType;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.restaurant.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Audit & Telemetry</h1>
          <p className="text-xs text-slate-500">Live platform transaction ledger across all merchants</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field text-xs py-1.5 bg-white"
          >
            <option value="all">All Modes</option>
            <option value="pickup">QuickPick Only</option>
            <option value="delivery">Delivery Only</option>
          </select>

          <div className="relative w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or Restaurant"
              className="input-field text-xs pl-9 py-1.5 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="card bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Merchant Outlet</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Total (₹)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                    {o.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{formatDateTime(o.createdAt)}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {o.restaurant.name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        o.fulfillmentType === 'pickup'
                          ? 'badge-brand text-[10px]'
                          : 'badge-info text-[10px]'
                      }
                    >
                      {o.fulfillmentType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatPrice(o.total)}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] text-slate-500">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {o.pickupOtp ? `OTP: ${o.pickupOtp}` : 'Rider Assigned'}
                  </td>
                  <td className="py-3 px-4 text-right">
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

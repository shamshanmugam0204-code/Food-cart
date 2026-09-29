import { useState } from 'react';
import { Search, Star, Zap, CheckCircle2, XCircle, Store, ExternalLink } from 'lucide-react';
import { restaurants } from '../../data/mock';
import { useUIStore } from '../../store';
import { formatPrice } from '../../lib/utils';
import type { Restaurant } from '../../types';

export default function AdminRestaurantsPage() {
  const { addNotification } = useUIStore();
  const [list, setList] = useState<Restaurant[]>(restaurants);
  const [search, setSearch] = useState('');

  const toggleQuickPickStatus = (id: string) => {
    setList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.hasQuickPick;
          addNotification({
            type: next ? 'success' : 'info',
            title: `QuickPick ${next ? 'Enabled' : 'Disabled'} for ${r.name}`,
          });
          return { ...r, hasQuickPick: next };
        }
        return r;
      })
    );
  };

  const toggleOutletActive = (id: string) => {
    setList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.isOpen;
          addNotification({
            type: next ? 'success' : 'warning',
            title: `${r.name} is now ${next ? 'Active (Open)' : 'Suspended / Closed'}`,
          });
          return { ...r, isOpen: next };
        }
        return r;
      })
    );
  };

  const filtered = list.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Restaurant Management</h1>
          <p className="text-xs text-slate-500">
            Moderate merchant partners, approve food trucks, and govern QuickPick privileges
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="input-field text-xs pl-9 py-1.5 bg-white"
          />
        </div>
      </div>

      <div className="card bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Restaurant</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Cuisine</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">QuickPick Status</th>
                <th className="py-3 px-4">Outlet State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <span>{r.name}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-600">{r.area}</td>

                  <td className="py-3 px-4 text-slate-500">{r.cuisine.join(', ')}</td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-current" />
                      {r.rating}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleQuickPickStatus(r.id)}
                      className={`badge text-[11px] font-semibold cursor-pointer ${
                        r.hasQuickPick
                          ? 'bg-brand-50 text-brand-700 border-brand-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      {r.hasQuickPick ? 'QuickPick Enabled' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[11px] font-semibold ${
                        r.isOpen
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {r.isOpen ? 'Operational' : 'Offline'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleOutletActive(r.id)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      {r.isOpen ? 'Suspend' : 'Activate'}
                    </button>
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

import { useState } from 'react';
import { Search, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { adminUsers } from '../../data/mock';
import { useUIStore } from '../../store';
import type { AdminUser } from '../../types';

export default function AdminUsersPage() {
  const { addNotification } = useUIStore();
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState('');

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'suspended' : 'active';
          addNotification({
            type: next === 'active' ? 'success' : 'warning',
            title: `User ${u.name} is now ${next}`,
          });
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Administration</h1>
          <p className="text-xs text-slate-500">Access control, customer accounts, and partner permissions</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name/email..."
            className="input-field text-xs pl-9 py-1.5 bg-white"
          />
        </div>
      </div>

      <div className="card bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Platform Role</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-500">{u.email}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] font-semibold ${
                        u.role === 'Partner'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">{u.orders}</td>

                  <td className="py-3 px-4 text-slate-500">{u.joinedDate}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`badge text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs font-semibold hover:underline ${
                        u.status === 'active' ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
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

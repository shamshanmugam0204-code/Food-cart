import { useNavigate, Link } from 'react-router-dom';
import { Store, LogIn, ArrowRight } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('partner');
    addNotification({
      type: 'success',
      title: 'Kitchen Portal Access Granted',
      message: 'Logged in as Spice Garden - Counter 2 Manager',
    });
    navigate('/partner/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="card p-8 bg-white max-w-md w-full shadow-modal space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FoodCart Partner Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kitchen Display System (KDS) & Order Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Outlet Terminal ID</label>
            <input
              type="text"
              defaultValue="SPICE-GARDEN-02"
              className="input-field text-xs font-mono font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Manager Passcode</label>
            <input
              type="password"
              defaultValue="••••••••"
              className="input-field text-xs font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-4"
          >
            <LogIn className="w-4 h-4" />
            <span>Enter Kitchen Terminal</span>
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/login" className="hover:text-slate-900">
            Customer sign in
          </Link>
          <Link to="/admin/dashboard" className="text-brand-600 font-semibold hover:underline">
            Admin Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}

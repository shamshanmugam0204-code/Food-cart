import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Store,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { ToastContainer } from '../common/Toast';
import { cn } from '../../lib/utils';

export function PartnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addNotification } = useUIStore();

  const [outletStatus, setOutletStatus] = useState<'open' | 'busy' | 'paused'>('open');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('Spice Garden - Koramangala');

  const navItems = [
    { name: 'Dashboard', href: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Live Orders', href: '/partner/orders', icon: ClipboardList, badge: '4' },
    { name: 'Menu Management', href: '/partner/menu', icon: UtensilsCrossed },
    { name: 'Analytics', href: '/partner/analytics', icon: BarChart3 },
    { name: 'Outlet Settings', href: '/partner/settings', icon: Settings },
  ];

  const handleStatusChange = (status: 'open' | 'busy' | 'paused') => {
    setOutletStatus(status);
    const labels = {
      open: 'Outlet is now Accepting Orders (Online)',
      busy: 'Outlet marked as Busy (Prep time +15 min)',
      paused: 'Outlet Paused (New orders disabled temporarily)',
    };
    addNotification({
      type: status === 'paused' ? 'warning' : 'success',
      title: 'Outlet Status Updated',
      message: labels[status],
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/partner/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col md:flex-row antialiased">
      <ToastContainer />

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            FC
          </div>
          <div>
            <p className="font-bold text-xs text-ink">FoodCart Partner</p>
            <p className="text-[10px] text-ink-muted leading-none">Kitchen Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              outletStatus === 'open' && 'bg-emerald-500',
              outletStatus === 'busy' && 'bg-amber-500',
              outletStatus === 'paused' && 'bg-red-500'
            )}
          />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg border border-gray-200 text-ink"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-200 md:static md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
              FC
            </div>
            <div>
              <p className="font-bold text-sm text-white">FoodCart Partner</p>
              <p className="text-[10px] text-slate-400">Order Management & POS</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outlet Switcher */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Active Outlet
          </label>
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-btn px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-brand-500"
          >
            <option value="Spice Garden - Koramangala">Spice Garden (Counter 2)</option>
            <option value="Spice Garden - Indiranagar">Spice Garden (Express)</option>
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                      isActive ? 'bg-white text-brand-600' : 'bg-brand-500 text-white'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick link to consumer view */}
        <div className="p-3 border-t border-slate-800">
          <Link
            to="/restaurant/r1"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-btn text-xs font-medium transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
              SG
            </div>
            <div className="truncate max-w-[110px]">
              <p className="text-white font-semibold truncate text-[11px]">Spice Garden</p>
              <p className="text-slate-400 text-[10px]">Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 p-1"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">{selectedOutlet}</h2>
              <p className="text-[11px] text-slate-500">QuickPick Terminal Active · Counter 2</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status pills */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold">
              <button
                onClick={() => handleStatusChange('open')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all',
                  outletStatus === 'open'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accepting</span>
              </button>

              <button
                onClick={() => handleStatusChange('busy')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all',
                  outletStatus === 'busy'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Busy (+15m)</span>
              </button>

              <button
                onClick={() => handleStatusChange('paused')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md transition-all',
                  outletStatus === 'paused'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            </div>

            <button
              className="p-2 rounded-btn border border-gray-200 hover:bg-gray-50 text-slate-600 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

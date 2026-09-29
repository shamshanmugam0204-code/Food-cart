import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { addNotification } = useUIStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'notifications'>('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Editable user state
  const [name, setName] = useState(user?.name || 'Arjun Mehta');
  const [email, setEmail] = useState(user?.email || 'arjun.mehta@email.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  // Notification toggles
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoOffers, setPromoOffers] = useState(true);
  const [quickPickReminders, setQuickPickReminders] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      type: 'success',
      title: 'Profile updated successfully!',
    });
  };

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'info',
      title: 'Logged out successfully',
    });
    navigate('/');
  };

  return (
    <div className="container-app py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Profile</h1>
          <p className="text-xs text-ink-muted mt-0.5">Manage personal information and preferences</p>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="btn-secondary text-xs text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 card p-3 space-y-1">
          {[
            { id: 'profile', label: 'Personal Information', icon: UserIcon },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'payments', label: 'Payment Methods', icon: CreditCard },
            { id: 'notifications', label: 'Notification Settings', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-xs font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-ink-secondary hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-ink-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-8 card p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="text-base font-bold text-ink pb-3 border-b border-gray-100">
                Personal Information
              </h2>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <button type="submit" className="btn-primary text-xs px-5 py-2.5 mt-2">
                Save Changes
              </button>
            </form>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-ink">Saved Addresses</h2>
                <button
                  type="button"
                  onClick={() => addNotification({ type: 'info', title: 'Add address modal simulated' })}
                  className="text-xs text-brand-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              <div className="space-y-3">
                {user?.addresses.map((addr) => (
                  <div key={addr.id} className="p-3.5 border border-gray-200 rounded-btn flex justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-ink">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="badge-brand text-[10px] py-0 px-1.5">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-secondary mt-1">{addr.full}</p>
                      <p className="text-[11px] text-ink-muted">{addr.city} - {addr.pincode}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 p-1" aria-label="Delete address">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-ink pb-3 border-b border-gray-100">
                Payment Methods
              </h2>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-btn flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-ink">FoodCart Wallet</p>
                    <p className="text-sm font-bold text-emerald-700">₹1,500.00 Balance</p>
                  </div>
                </div>
                <button
                  onClick={() => addNotification({ type: 'success', title: 'Added ₹500 to wallet (Demo)' })}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Top Up
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-ink-muted uppercase">Saved UPI & Cards</p>
                <div className="p-3 border border-gray-200 rounded-btn flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-brand-600" />
                    <span>arjun@okaxis (Google Pay)</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Verified</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-btn flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>HDFC Bank Debit Card ending •••• 8912</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Saved</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-ink pb-3 border-b border-gray-100">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink">Order Status Updates</p>
                    <p className="text-[11px] text-ink-muted">Receive live alerts when food is cooking or on the way.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderUpdates}
                    onChange={(e) => setOrderUpdates(e.target.checked)}
                    className="w-4 h-4 accent-brand-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink">QuickPick Ready Reminder</p>
                    <p className="text-[11px] text-ink-muted">SMS and buzzer notification when your order is at the counter.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={quickPickReminders}
                    onChange={(e) => setQuickPickReminders(e.target.checked)}
                    className="w-4 h-4 accent-brand-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-ink">Discounts and Offers</p>
                    <p className="text-[11px] text-ink-muted">Get notifications about seasonal promotions and coupons.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={promoOffers}
                    onChange={(e) => setPromoOffers(e.target.checked)}
                    className="w-4 h-4 accent-brand-500 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your FoodCart account?"
        confirmLabel="Log Out"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

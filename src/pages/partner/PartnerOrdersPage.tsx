import { useState } from 'react';
import {
  Clock,
  Store,
  Truck,
  CheckCircle,
  Key,
  QrCode,
  AlertCircle,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useOrdersStore, useUIStore } from '../../store';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatPrice, formatDateTime } from '../../lib/utils';
import type { Order, OrderStatus } from '../../types';

export default function PartnerOrdersPage() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useUIStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'preparing', label: 'Preparing (3)' },
    { id: 'ready', label: 'Ready for Pickup (1)' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'preparing') return o.status === 'preparing' || o.status === 'confirmed';
    if (activeTab === 'ready') return o.status === 'ready';
    if (activeTab === 'completed') return o.status === 'delivered' || o.status === 'picked_up';
    return true;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Order marked as ${nextStatus.toUpperCase()}`,
    });
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;

    if (inputOtp.trim() === verifyingOrder.pickupOtp || inputOtp.trim() === '123456') {
      updateOrderStatus(verifyingOrder.id, 'picked_up');
      addNotification({
        type: 'success',
        title: 'Pickup Verified & Completed!',
        message: `Order #${verifyingOrder.orderNumber} successfully handed over.`,
      });
      setVerifyingOrder(null);
      setInputOtp('');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please check the code on the customer screen.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kitchen Order Board</h1>
          <p className="text-xs text-slate-500">Manage incoming tickets, prep stages, and QuickPick handoffs</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-white p-1 rounded-btn border border-gray-200 text-xs font-semibold overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const isPickup = order.fulfillmentType === 'pickup';

          return (
            <div
              key={order.id}
              className={`card p-5 bg-white border transition-all ${
                order.status === 'ready'
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    {isPickup ? (
                      <span className="badge-brand text-[10px] font-bold">QuickPick</span>
                    ) : (
                      <span className="badge-info text-[10px] font-bold">Delivery</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customer: Arjun Mehta · {order.estimatedTime}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Items List */}
              <div className="py-3 text-xs text-slate-700 space-y-1.5 min-h-[70px]">
                {order.items.length > 0 ? (
                  order.items.map((i) => (
                    <div key={i.id} className="flex justify-between items-start">
                      <span className="font-medium">
                        {i.quantity}x {i.menuItem.name}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {formatPrice(i.totalPrice)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>2x Chicken Biryani, 1x Naan</span>
                    <span className="font-medium">{formatPrice(order.total)}</span>
                  </div>
                )}

                {isPickup && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 p-1.5 rounded text-[11px] text-amber-800 font-semibold flex items-center justify-between">
                    <span>Target: {order.pickupCounter || 'Counter 2'}</span>
                    <span>Expected: {order.pickupOtp}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons based on state */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                {order.status === 'placed' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                    className="btn-primary w-full py-1.5 text-xs"
                  >
                    Accept & Mark Preparing
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        order.id,
                        isPickup ? 'ready' : 'out_for_delivery'
                      )
                    }
                    className="btn-primary w-full py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isPickup ? 'Mark Ready for Pickup' : 'Handover to Rider'}
                  </button>
                )}

                {order.status === 'ready' && isPickup && (
                  <button
                    onClick={() => {
                      setVerifyingOrder(order);
                      setInputOtp('');
                      setOtpError('');
                    }}
                    className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Verify Customer OTP</span>
                  </button>
                )}

                {order.status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    className="btn-secondary w-full py-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  >
                    Mark as Delivered
                  </button>
                )}

                {(order.status === 'picked_up' || order.status === 'delivered') && (
                  <div className="w-full text-center text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1 py-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed & Handed Over</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OTP Verification Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card p-6 bg-white max-w-sm w-full space-y-4 shadow-modal">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Verify QuickPick OTP
                </h3>
              </div>
              <button
                onClick={() => setVerifyingOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                Order #{verifyingOrder.orderNumber}
              </p>
              <p className="text-slate-500">
                Ask customer for the 6-digit OTP displayed on their screen.
              </p>
              <p className="text-[10px] text-brand-600 font-bold">
                (Demo Hint: Customer's OTP is {verifyingOrder.pickupOtp})
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputOtp}
                  onChange={(e) => {
                    setInputOtp(e.target.value);
                    setOtpError('');
                  }}
                  placeholder="e.g. 438912"
                  className="input-field text-center tracking-widest text-lg font-bold"
                  autoFocus
                />
                {otpError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputOtp(verifyingOrder.pickupOtp || '438912');
                  }}
                  className="btn-secondary text-xs px-2.5 py-2 flex-shrink-0"
                >
                  Auto-fill
                </button>
                <button type="submit" className="btn-primary text-xs flex-1 py-2 font-bold">
                  Confirm & Hand Over
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

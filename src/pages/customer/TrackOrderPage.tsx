import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Store,
  Phone,
  HelpCircle,
  CheckCircle2,
  Navigation,
  RefreshCw,
  QrCode,
  MapPin,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { useOrdersStore, useUIStore } from '../../store';
import { OrderStatusTimeline } from '../../components/customer/OrderStatusTimeline';
import { QRCodeCard } from '../../components/customer/QRCodeCard';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatPrice, cn } from '../../lib/utils';
import type { OrderStatus } from '../../types';

export default function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrderStatus } = useOrdersStore();
  const { addNotification } = useUIStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.status || 'preparing');
  const [hasArrived, setHasArrived] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-bold text-ink">Order Not Found</h2>
        <Link to="/orders" className="btn-primary mt-4">
          View All Orders
        </Link>
      </div>
    );
  }

  const isQuickPick = order.fulfillmentType === 'pickup';

  // Demo simulator helper to advance order status for demonstration
  const handleAdvanceStatus = () => {
    const pickupFlow: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'ready', 'picked_up'];
    const deliveryFlow: OrderStatus[] = [
      'placed',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
    ];
    const flow = isQuickPick ? pickupFlow : deliveryFlow;
    const currentIdx = flow.indexOf(currentStatus);

    if (currentIdx < flow.length - 1) {
      const nextStatus = flow[currentIdx + 1];
      setCurrentStatus(nextStatus);
      updateOrderStatus(order.id, nextStatus);
      addNotification({
        type: 'info',
        title: 'Status Updated (Demo Simulation)',
        message: `Order status changed to: ${nextStatus.toUpperCase()}`,
      });
    }
  };

  const handleArrived = () => {
    setHasArrived(true);
    addNotification({
      type: 'success',
      title: 'Outlet Notified!',
      message: 'The counter staff has been notified that you have arrived.',
    });
  };

  return (
    <div className="container-app py-8 max-w-4xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">Track Order</h1>
            <span className="text-xs bg-gray-100 text-ink font-mono font-bold px-2 py-0.5 rounded">
              {order.orderNumber}
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            {order.restaurant.name} ·{' '}
            {isQuickPick ? 'QuickPick Queue-Free Pickup' : 'Home Delivery'}
          </p>
        </div>

        {/* Demo Simulator Controller */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-btn shadow-sm">
          <span className="text-[11px] font-semibold text-ink-muted">Simulate:</span>
          <button
            onClick={handleAdvanceStatus}
            className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1 hover:border-brand-400"
          >
            <RefreshCw className="w-3 h-3 text-brand-500" />
            <span>Next Stage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Status Timeline & Live State */}
        <div className="md:col-span-7 space-y-6">
          {/* Active Status Highlight Card */}
          <div className="card p-5 border-l-4 border-l-brand-500 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                  Current Status
                </span>
                <h2 className="text-lg font-bold text-ink mt-0.5">
                  {currentStatus === 'preparing' && 'Preparing your delicious food...'}
                  {currentStatus === 'ready' && '🎉 Your food is ready for collection!'}
                  {currentStatus === 'picked_up' && 'Order completed! Enjoy your meal.'}
                  {currentStatus === 'out_for_delivery' && '🛵 Rider is on the way to you!'}
                  {currentStatus === 'delivered' && 'Order delivered! Enjoy your meal.'}
                  {currentStatus === 'placed' && 'Order received and being verified.'}
                  {currentStatus === 'confirmed' && 'Restaurant confirmed your order.'}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* QuickPick queue info */}
            {isQuickPick && currentStatus !== 'picked_up' && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-btn p-3 text-xs text-amber-900 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Estimated Ready: {order.estimatedTime}</span>
                  <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                    2 orders ahead
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Head to <span className="font-bold">{order.pickupCounter || 'Counter 2'}</span>{' '}
                  at {order.restaurant.name}.
                </p>
              </div>
            )}

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              {isQuickPick && currentStatus !== 'picked_up' && (
                <button
                  onClick={handleArrived}
                  disabled={hasArrived}
                  className={cn(
                    'btn-secondary text-xs px-3 py-2 flex items-center gap-1.5',
                    hasArrived && 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                  )}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {hasArrived ? 'Staff Notified (You Arrived)' : 'I Have Arrived'}
                </button>
              )}

              {isQuickPick && (
                <button
                  onClick={() => setShowQRModal(true)}
                  className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Show QuickPick QR / OTP
                </button>
              )}

              <button
                onClick={() => setShowSupportModal(true)}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Help / Support
              </button>
            </div>
          </div>

          {/* Delivery Map placeholder (for delivery only) */}
          {!isQuickPick && (
            <div className="card overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" /> Live Delivery Route
                </span>
                <span className="text-ink-muted">ETA: {order.estimatedTime}</span>
              </div>
              <div className="relative h-48 bg-stone-100 flex items-center justify-center p-4">
                {/* Visual stylized mock map canvas */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="inline-flex items-center gap-4 bg-white/95 px-4 py-2 rounded-xl shadow-card border border-gray-200">
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink">
                      <Store className="w-4 h-4 text-brand-600" />
                      <span>{order.restaurant.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Your Address</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-ink-muted">
                    Rider: Ramesh Kumar (+91 98450 12345)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vertical Timeline Card */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-ink mb-4 pb-2 border-b border-gray-100">
              Live Order Progress
            </h3>
            <OrderStatusTimeline
              statusHistory={order.statusHistory}
              currentStatus={currentStatus}
              fulfillmentType={order.fulfillmentType}
            />
          </div>
        </div>

        {/* Right Column: Order Details & Persistent QR Card */}
        <div className="md:col-span-5 space-y-6">
          {/* QuickPick QR & OTP always accessible */}
          {isQuickPick && (
            <QRCodeCard
              orderNumber={order.orderNumber}
              otp={order.pickupOtp || '438912'}
              counter={order.pickupCounter || 'Counter 2'}
              estimatedTime={order.estimatedTime}
              restaurantName={order.restaurant.name}
            />
          )}

          {/* Restaurant & Order Info Card */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-ink">{order.restaurant.name}</h3>
                <p className="text-xs text-ink-muted">{order.restaurant.area}, Bengaluru</p>
              </div>
              <a
                href="tel:+919876543210"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-ink transition-colors"
                aria-label="Call restaurant"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-ink-muted uppercase text-[11px]">
                Items in Order
              </p>
              {order.items.length > 0 ? (
                order.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-ink-secondary">
                    <span>
                      {i.quantity}x {i.menuItem.name}
                    </span>
                    <span className="font-medium text-ink">{formatPrice(i.totalPrice)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-ink-secondary">
                  <span>2x Items Ordered</span>
                  <span className="font-medium text-ink">{formatPrice(order.total)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-ink">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Dialog */}
      <ConfirmationDialog
        isOpen={showSupportModal}
        title="FoodCart Support"
        message="Need help with your order? Our support team is available 24/7. Call our helpline at 1800-419-7000 or chat with us on WhatsApp."
        confirmLabel="Call Helpline"
        cancelLabel="Close"
        onConfirm={() => {
          window.open('tel:18004197000');
          setShowSupportModal(false);
        }}
        onCancel={() => setShowSupportModal(false)}
      />
    </div>
  );
}

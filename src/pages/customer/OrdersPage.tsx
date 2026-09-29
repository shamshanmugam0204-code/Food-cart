import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Store,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useOrdersStore, useCartStore, useUIStore } from '../../store';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPrice, formatDateTime } from '../../lib/utils';
import type { Order } from '../../types';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useOrdersStore();
  const { addItem, setFulfillmentType } = useCartStore();
  const { addNotification } = useUIStore();

  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
  );

  const pastOrders = orders.filter((o) =>
    ['delivered', 'picked_up', 'cancelled'].includes(o.status)
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (order: Order) => {
    setFulfillmentType(order.fulfillmentType);
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addItem(item.menuItem, item.quantity, item.customizations, item.specialInstructions);
      });
      addNotification({
        type: 'success',
        title: 'Items re-added to cart!',
      });
      navigate('/cart');
    } else {
      navigate(`/restaurant/${order.restaurant.id}`);
    }
  };

  return (
    <div className="container-app py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Orders</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Track ongoing deliveries and review past orders
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'active' ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Active Orders ({activeOrders.length})
          {activeTab === 'active' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'past' ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
          }`}
        >
          Past Orders ({pastOrders.length})
          {activeTab === 'past' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Order Cards */}
      {displayedOrders.length === 0 ? (
        <EmptyState
          icon="orders"
          title={activeTab === 'active' ? 'No active orders' : 'No past orders yet'}
          description={
            activeTab === 'active'
              ? 'You do not have any ongoing food preparation or delivery right now.'
              : 'Your past orders will appear here once completed.'
          }
          actionLabel="Explore Restaurants"
          actionHref="/explore"
        />
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isPickup = order.fulfillmentType === 'pickup';

            return (
              <div
                key={order.id}
                className="card p-5 hover:border-gray-300 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-ink">{order.restaurant.name}</h3>
                      {isPickup ? (
                        <span className="badge-brand text-[11px] font-semibold flex items-center gap-1">
                          <Store className="w-3 h-3" /> QuickPick
                        </span>
                      ) : (
                        <span className="badge-info text-[11px] font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Delivery
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Order #{order.orderNumber} · {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <StatusBadge status={order.status} size="md" />
                </div>

                {/* Items preview */}
                <div className="py-3 text-xs text-ink-secondary space-y-1">
                  {order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="font-medium text-ink">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between">
                      <span>2x Popular Dishes</span>
                      <span className="font-medium text-ink">{formatPrice(order.total)}</span>
                    </div>
                  )}

                  {isPickup && order.pickupCounter && (
                    <p className="text-[11px] text-brand-700 font-semibold pt-1">
                      Counter: {order.pickupCounter} · OTP: {order.pickupOtp}
                    </p>
                  )}
                </div>

                {/* Footer and CTAs */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-ink-muted">Total Paid: </span>
                    <span className="font-bold text-ink text-sm">{formatPrice(order.total)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder
                    </button>

                    <Link
                      to={`/track-order/${order.id}`}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

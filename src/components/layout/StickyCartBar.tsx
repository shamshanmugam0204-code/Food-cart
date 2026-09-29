import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store';
import { formatPrice } from '../../lib/utils';

export function StickyCartBar() {
  const location = useLocation();
  const { items, getItemCount, getSubtotal } = useCartStore();
  const count = getItemCount();

  // Hide on cart, checkout, confirmation, partner, and admin pages
  const isHidden =
    ['/cart', '/checkout', '/order-confirmation'].some((p) =>
      location.pathname.startsWith(p)
    ) ||
    location.pathname.startsWith('/partner') ||
    location.pathname.startsWith('/admin') ||
    count === 0;

  if (isHidden) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
      <Link
        to="/cart"
        className="bg-brand-500 text-white rounded-xl shadow-dropdown px-4 py-3 flex items-center justify-between transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
            {count}
          </div>
          <div>
            <p className="text-xs uppercase font-medium tracking-wide text-white/80">View Cart</p>
            <p className="text-sm font-bold">{formatPrice(getSubtotal())}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </div>
  );
}

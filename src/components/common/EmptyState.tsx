import { ShoppingBag, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: 'cart' | 'search' | 'orders' | 'favorites' | 'location';
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  cart: ShoppingBag,
  search: Search,
  orders: ShoppingBag,
  favorites: ShoppingBag,
  location: MapPin,
};

export function EmptyState({
  icon = 'cart',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-ink-faint" />
      </div>
      <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-xs">{description}</p>
      {actionLabel && (
        actionHref ? (
          <Link to={actionHref} className="btn-primary mt-6">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary mt-6">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

import { Truck, Store } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FulfillmentType } from '../../types';

interface FulfillmentToggleProps {
  value: FulfillmentType;
  onChange: (type: FulfillmentType) => void;
  deliveryTime?: number;
  pickupTime?: number;
  compact?: boolean;
  className?: string;
}

export function FulfillmentToggle({
  value,
  onChange,
  deliveryTime,
  pickupTime,
  compact = false,
  className,
}: FulfillmentToggleProps) {
  return (
    <div className={cn('inline-flex bg-gray-100 rounded-btn p-1', className)}>
      <button
        onClick={() => onChange('delivery')}
        className={cn(
          'flex items-center gap-2 rounded-lg transition-all duration-200 font-medium',
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
          value === 'delivery'
            ? 'bg-white text-ink shadow-sm'
            : 'text-ink-muted hover:text-ink'
        )}
        aria-pressed={value === 'delivery'}
      >
        <Truck className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        <span>Delivery</span>
        {deliveryTime && !compact && (
          <span className="text-xs text-ink-faint">{deliveryTime} min</span>
        )}
      </button>
      <button
        onClick={() => onChange('pickup')}
        className={cn(
          'flex items-center gap-2 rounded-lg transition-all duration-200 font-medium',
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
          value === 'pickup'
            ? 'bg-white text-ink shadow-sm'
            : 'text-ink-muted hover:text-ink'
        )}
        aria-pressed={value === 'pickup'}
      >
        <Store className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        <span>Pickup</span>
        {pickupTime && !compact && (
          <span className="text-xs text-ink-faint">{pickupTime} min</span>
        )}
      </button>
    </div>
  );
}

import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 0,
  max = 20,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center border border-brand-200 bg-brand-50 rounded-btn overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={cn(
          'flex items-center justify-center text-brand-600 hover:bg-brand-100 transition-colors disabled:opacity-40',
          size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>
      <span
        className={cn(
          'font-semibold text-brand-700 text-center',
          size === 'sm' ? 'w-7 text-xs' : 'w-8 text-sm'
        )}
      >
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center text-brand-600 hover:bg-brand-100 transition-colors disabled:opacity-40',
          size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
        )}
        aria-label="Increase quantity"
      >
        <Plus className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>
    </div>
  );
}

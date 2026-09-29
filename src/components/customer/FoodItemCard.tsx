import { useState } from 'react';
import { Plus, Star, Clock } from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import type { MenuItem } from '../../types';

interface FoodItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  className?: string;
}

export function FoodItemCard({ item, onAdd, className }: FoodItemCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className={cn('flex gap-4 py-4 border-b border-gray-100 last:border-b-0', className)}>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'} />
          {item.isBestseller && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              Bestseller
            </span>
          )}
        </div>
        <h4 className="font-medium text-ink text-sm mb-0.5">{item.name}</h4>
        <p className="font-semibold text-sm text-ink mb-1.5">{formatPrice(item.price)}</p>

        {item.rating && (
          <div className="flex items-center gap-1 text-xs text-ink-muted mb-1.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
            {item.ratingCount && <span>({item.ratingCount})</span>}
          </div>
        )}

        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Image + Add */}
      <div className="flex-shrink-0 w-[118px] relative">
        <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
          {!imgLoaded && <div className="absolute inset-0 skeleton rounded-lg" />}
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={cn(
              'w-full h-full object-cover',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-medium text-ink-muted">Unavailable</span>
            </div>
          )}
        </div>
        <button
          onClick={() => item.isAvailable && onAdd(item)}
          disabled={!item.isAvailable}
          className={cn(
            'absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1',
            'bg-white text-brand-600 font-semibold text-sm border border-brand-200',
            'px-6 py-1.5 rounded-btn shadow-sm',
            'hover:bg-brand-50 active:bg-brand-100 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus className="w-4 h-4" />
          ADD
        </button>
        {item.customizations && item.customizations.length > 0 && item.isAvailable && (
          <p className="text-[10px] text-ink-faint text-center mt-4">Customisable</p>
        )}
      </div>
    </div>
  );
}

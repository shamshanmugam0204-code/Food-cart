import { Link } from 'react-router-dom';
import { Star, Clock, Zap, Store } from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import type { Restaurant } from '../../types';
import { useState } from 'react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className={cn('card-interactive block overflow-hidden group', className)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-md">
              Currently closed
            </span>
          </div>
        )}
        {restaurant.offer && restaurant.isOpen && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {restaurant.offer}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-ink text-[15px] leading-tight truncate">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0">
            <Star className="w-3 h-3 fill-current" />
            {restaurant.rating}
          </div>
        </div>

        <p className="text-xs text-ink-muted truncate mb-2">
          {restaurant.cuisine.join(', ')} · {formatPrice(restaurant.priceForTwo)} for two
        </p>

        <div className="flex items-center gap-3 text-xs text-ink-secondary">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {restaurant.deliveryTime} min
          </span>
          <span className="text-ink-faint">·</span>
          <span>{restaurant.distance}</span>
          {restaurant.hasQuickPick && (
            <>
              <span className="text-ink-faint">·</span>
              <span className="flex items-center gap-1 text-brand-600 font-medium">
                <Zap className="w-3.5 h-3.5" />
                QuickPick
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

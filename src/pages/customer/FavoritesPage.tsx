import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useOrdersStore } from '../../store';
import { restaurants } from '../../data/mock';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import { EmptyState } from '../../components/common/EmptyState';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useOrdersStore();

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Favorite Restaurants</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Quickly access menus and place orders from your top spots
        </p>
      </div>

      {favoriteRestaurants.length === 0 ? (
        <EmptyState
          icon="favorites"
          title="No favorites saved"
          description="Click the heart icon on any restaurant to add it to your favorites list for instant access."
          actionLabel="Explore Restaurants"
          actionHref="/explore"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteRestaurants.map((r) => (
            <div key={r.id} className="relative group">
              <RestaurantCard restaurant={r} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(r.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-sm transition-colors z-10"
                aria-label="Remove from favorites"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

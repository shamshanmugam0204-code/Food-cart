import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, X, Utensils, Store } from 'lucide-react';
import { restaurants, menuItems } from '../../data/mock';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import { FoodItemCard } from '../../components/customer/FoodItemCard';
import { EmptyState } from '../../components/common/EmptyState';
import { CustomizationModal } from '../../components/customer/CustomizationModal';
import { useCartStore, useUIStore } from '../../store';
import { cn } from '../../lib/utils';
import type { MenuItem, SelectedCustomization } from '../../types';

const quickKeywords = ['Biryani', 'Burgers', 'Momos', 'Dosa', 'Coffee', 'Desserts', 'Healthy'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'dishes'>('all');
  const [selectedCustomItem, setSelectedCustomItem] = useState<MenuItem | null>(null);

  const { addItem } = useCartStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const handleChipClick = (keyword: string) => {
    setQuery(keyword);
    setSearchParams({ q: keyword });
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({});
  };

  // Search logic
  const normalized = query.toLowerCase().trim();

  const matchedRestaurants = useMemo(() => {
    if (!normalized) return [];
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(normalized) ||
        r.cuisine.some((c) => c.toLowerCase().includes(normalized)) ||
        r.area.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  const matchedDishes = useMemo(() => {
    if (!normalized) return [];
    return menuItems.filter(
      (m) =>
        m.name.toLowerCase().includes(normalized) ||
        m.description.toLowerCase().includes(normalized) ||
        m.category.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  const handleAddItem = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setSelectedCustomItem(item);
    } else {
      addItem(item, 1, []);
      addNotification({
        type: 'success',
        title: `Added ${item.name} to cart`,
      });
    }
  };

  const handleCustomizationAdd = (
    item: MenuItem,
    qty: number,
    customs: SelectedCustomization[],
    instructions?: string
  ) => {
    addItem(item, qty, customs, instructions);
    addNotification({
      type: 'success',
      title: `Added ${item.name} (${qty}) to cart`,
    });
  };

  const totalResults = matchedRestaurants.length + matchedDishes.length;

  return (
    <div className="container-app py-6 max-w-4xl">
      {/* Search Input Box */}
      <div className="card p-4 sm:p-5 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, dishes, or cuisines..."
            className="input-field pl-12 pr-10 py-3 text-base shadow-sm"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-faint hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide pt-1">
          <span className="text-xs text-ink-muted flex-shrink-0 font-medium">Popular:</span>
          {quickKeywords.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleChipClick(k)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border transition-colors flex-shrink-0',
                query.toLowerCase() === k.toLowerCase()
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-ink-secondary border-gray-200 hover:border-gray-300'
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* When no query is entered */}
      {!query.trim() && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-ink-faint">
            <SearchIcon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-1">Search FoodCart</h2>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            Find your favorite dishes from top restaurants, cloud kitchens, and QuickPick outlets.
          </p>
        </div>
      )}

      {/* Query entered */}
      {query.trim() && (
        <div>
          {/* Result Filter Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'text-sm font-semibold pb-1 relative transition-colors',
                  activeTab === 'all'
                    ? 'text-brand-600'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                All ({totalResults})
                {activeTab === 'all' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={cn(
                  'text-sm font-semibold pb-1 relative transition-colors flex items-center gap-1',
                  activeTab === 'restaurants'
                    ? 'text-brand-600'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Store className="w-4 h-4" />
                Restaurants ({matchedRestaurants.length})
                {activeTab === 'restaurants' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('dishes')}
                className={cn(
                  'text-sm font-semibold pb-1 relative transition-colors flex items-center gap-1',
                  activeTab === 'dishes'
                    ? 'text-brand-600'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                <Utensils className="w-4 h-4" />
                Dishes ({matchedDishes.length})
                {activeTab === 'dishes' && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Empty state */}
          {totalResults === 0 && (
            <EmptyState
              icon="search"
              title={`No results found for "${query}"`}
              description="Check the spelling or try searching for another dish or restaurant name."
              actionLabel="Explore All Restaurants"
              actionHref="/explore"
            />
          )}

          {/* Restaurants Results */}
          {(activeTab === 'all' || activeTab === 'restaurants') && matchedRestaurants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                Restaurants ({matchedRestaurants.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {matchedRestaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {/* Dishes Results */}
          {(activeTab === 'all' || activeTab === 'dishes') && matchedDishes.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-brand-600" />
                Dishes ({matchedDishes.length})
              </h3>
              <div className="card p-4 sm:p-5 divide-y divide-gray-100">
                {matchedDishes.map((dish) => (
                  <FoodItemCard
                    key={dish.id}
                    item={dish}
                    onAdd={handleAddItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customization modal */}
      <CustomizationModal
        item={selectedCustomItem}
        isOpen={Boolean(selectedCustomItem)}
        onClose={() => setSelectedCustomItem(null)}
        onAddToCart={handleCustomizationAdd}
      />
    </div>
  );
}

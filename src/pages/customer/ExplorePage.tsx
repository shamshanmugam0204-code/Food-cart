import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, Zap } from 'lucide-react';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import { RestaurantCardSkeleton } from '../../components/common/LoadingSkeleton';
import { FulfillmentToggle } from '../../components/common/FulfillmentToggle';
import { EmptyState } from '../../components/common/EmptyState';
import { restaurants } from '../../data/mock';
import { useCartStore } from '../../store';
import { simulateDelay, cn } from '../../lib/utils';

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'fastest_delivery', label: 'Fastest delivery' },
  { value: 'fastest_pickup', label: 'Fastest pickup' },
  { value: 'top_rated', label: 'Top rated' },
  { value: 'cost_low', label: 'Cost: low to high' },
];

const cuisineFilters = ['North Indian', 'South Indian', 'Burgers', 'Biryani', 'Chinese', 'Cafe', 'Healthy', 'Street Food'];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [vegOnly, setVegOnly] = useState(false);
  const [quickPickOnly, setQuickPickOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const { fulfillmentType, setFulfillmentType } = useCartStore();

  useEffect(() => {
    const cuisine = searchParams.get('cuisine');
    if (cuisine) {
      const mapped: Record<string, string> = {
        biryani: 'Biryani', burgers: 'Burgers', pizza: 'Pizza',
        'south-indian': 'South Indian', desserts: 'Desserts',
        beverages: 'Beverages', chinese: 'Chinese', healthy: 'Healthy',
      };
      if (mapped[cuisine]) setSelectedCuisines([mapped[cuisine]]);
    }
    simulateDelay(600).then(() => setLoading(false));
  }, [searchParams]);

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (selectedCuisines.length > 0) {
      result = result.filter((r) => r.cuisine.some((c) => selectedCuisines.includes(c)));
    }
    if (vegOnly) result = result.filter((r) => r.isVeg);
    if (quickPickOnly) result = result.filter((r) => r.hasQuickPick);
    if (openOnly) result = result.filter((r) => r.isOpen);

    switch (sortBy) {
      case 'fastest_delivery': result.sort((a, b) => a.deliveryTime - b.deliveryTime); break;
      case 'fastest_pickup': result.sort((a, b) => a.pickupTime - b.pickupTime); break;
      case 'top_rated': result.sort((a, b) => b.rating - a.rating); break;
      case 'cost_low': result.sort((a, b) => a.priceForTwo - b.priceForTwo); break;
    }

    return result;
  }, [selectedCuisines, vegOnly, quickPickOnly, openOnly, sortBy]);

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const activeFilterCount = selectedCuisines.length + (vegOnly ? 1 : 0) + (quickPickOnly ? 1 : 0) + (openOnly ? 1 : 0);

  return (
    <div className="container-app py-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Explore restaurants</h1>
          <p className="text-sm text-ink-muted">{filteredRestaurants.length} restaurants found</p>
        </div>
        <FulfillmentToggle value={fulfillmentType} onChange={setFulfillmentType} compact />
      </div>

      {/* Filter/Sort bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'btn-secondary text-xs flex-shrink-0 relative',
            activeFilterCount > 0 && 'border-brand-300 bg-brand-50 text-brand-700'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="btn-secondary text-xs"
          >
            {sortOptions.find((s) => s.value === sortBy)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-card shadow-dropdown border border-gray-100 z-20 py-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors',
                      sortBy === opt.value && 'text-brand-600 font-medium bg-brand-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick filter chips */}
        <button
          onClick={() => setQuickPickOnly(!quickPickOnly)}
          className={cn(
            'btn-secondary text-xs flex-shrink-0',
            quickPickOnly && 'border-brand-300 bg-brand-50 text-brand-700'
          )}
        >
          <Zap className="w-3.5 h-3.5" /> QuickPick
        </button>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={cn(
            'btn-secondary text-xs flex-shrink-0',
            vegOnly && 'border-green-300 bg-green-50 text-green-700'
          )}
        >
          <span className="w-2.5 h-2.5 border border-green-600 rounded-sm bg-green-600" />
          Veg only
        </button>
        <button
          onClick={() => setOpenOnly(!openOnly)}
          className={cn(
            'btn-secondary text-xs flex-shrink-0',
            openOnly && 'border-emerald-300 bg-emerald-50 text-emerald-700'
          )}
        >
          Open now
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-ink">Cuisine</h3>
            {selectedCuisines.length > 0 && (
              <button onClick={() => setSelectedCuisines([])} className="text-xs text-brand-600 font-medium">
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {cuisineFilters.map((c) => (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-btn border transition-colors',
                  selectedCuisines.includes(c)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-ink-secondary border-gray-200 hover:border-gray-300'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCuisines.map((c) => (
            <span key={c} className="badge-brand flex items-center gap-1">
              {c}
              <button onClick={() => toggleCuisine(c)} aria-label={`Remove ${c} filter`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <EmptyState
          icon="search"
          title="No restaurants found"
          description="Try adjusting your filters or search in a different area."
          actionLabel="Clear filters"
          onAction={() => {
            setSelectedCuisines([]);
            setVegOnly(false);
            setQuickPickOnly(false);
            setOpenOnly(false);
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}

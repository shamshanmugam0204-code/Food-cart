import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, ChevronDown, User, Menu, X, Heart, ClipboardList, LogIn } from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore, useLocationStore } from '../../store';
import { locations } from '../../data/mock';
import { cn } from '../../lib/utils';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCartStore();
  const { isMobileMenuOpen, setMobileMenu, isLocationSelectorOpen, setLocationSelector } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { selectedLocation, setLocation } = useLocationStore();
  const itemCount = getItemCount();

  const isPartner = location.pathname.startsWith('/partner');
  const isAdmin = location.pathname.startsWith('/admin');
  if (isPartner || isAdmin) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-app">
        <div className="flex items-center gap-3 h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="font-bold text-lg text-ink hidden sm:block">FoodCart</span>
          </Link>

          {/* Location selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationSelector(!isLocationSelectorOpen)}
              className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors px-2 py-1.5 rounded-btn hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4 text-brand-500" />
              <span className="max-w-[180px] truncate">{selectedLocation.area}, {selectedLocation.city}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {isLocationSelectorOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLocationSelector(false)} />
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-card shadow-dropdown border border-gray-100 z-20 py-1">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">Delivering to</p>
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => { setLocation(loc); setLocationSelector(false); }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2',
                        selectedLocation.id === loc.id && 'bg-brand-50 text-brand-700'
                      )}
                    >
                      <MapPin className="w-4 h-4 flex-shrink-0 text-ink-faint" />
                      <div>
                        <p className="font-medium">{loc.area}</p>
                        <p className="text-xs text-ink-muted">{loc.city} {loc.pincode}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, restaurants or cuisines"
                className="input-field pl-10 py-2 text-sm bg-gray-50"
                aria-label="Search"
              />
            </div>
          </form>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/explore" className="btn-ghost text-sm">Explore</Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="btn-ghost text-sm">
                  <ClipboardList className="w-4 h-4" />
                  Orders
                </Link>
                <Link to="/favorites" className="btn-ghost text-sm">
                  <Heart className="w-4 h-4" />
                  Favorites
                </Link>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {/* Mobile search */}
            <Link to="/search" className="btn-icon sm:hidden" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="btn-icon relative" aria-label={`Cart with ${itemCount} items`}>
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="btn-ghost text-sm hidden lg:flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">{user?.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-card shadow-dropdown border border-gray-100 py-1 hidden group-hover:block">
                  <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">Profile</Link>
                  <Link to="/orders" className="block px-3 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                  <Link to="/favorites" className="block px-3 py-2 text-sm hover:bg-gray-50">Favorites</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm hidden lg:flex">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="btn-icon lg:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container-app py-3 space-y-1">
            {/* Mobile location */}
            <button
              onClick={() => { setLocationSelector(!isLocationSelectorOpen); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-btn hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>{selectedLocation.area}, {selectedLocation.city}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-auto" />
            </button>
            {isLocationSelectorOpen && (
              <div className="ml-6 space-y-0.5 pb-2">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => { setLocation(loc); setLocationSelector(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-btn',
                      selectedLocation.id === loc.id ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-gray-50'
                    )}
                  >
                    {loc.area}
                  </button>
                ))}
              </div>
            )}

            <Link to="/explore" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-btn hover:bg-gray-50">
              <Search className="w-4 h-4" /> Explore
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-btn hover:bg-gray-50">
                  <ClipboardList className="w-4 h-4" /> Orders
                </Link>
                <Link to="/favorites" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-btn hover:bg-gray-50">
                  <Heart className="w-4 h-4" /> Favorites
                </Link>
                <Link to="/profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-btn hover:bg-gray-50">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <hr className="border-gray-100" />
                <button onClick={() => { logout(); setMobileMenu(false); }} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 rounded-btn hover:bg-red-50 w-full">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-brand-600 font-medium rounded-btn hover:bg-brand-50">
                <LogIn className="w-4 h-4" /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

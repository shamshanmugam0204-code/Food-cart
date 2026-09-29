import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Store, Zap, Clock, Shield, Star, ChevronRight } from 'lucide-react';
import { RestaurantCard } from '../../components/customer/RestaurantCard';
import { FulfillmentToggle } from '../../components/common/FulfillmentToggle';
import { useCartStore } from '../../store';
import { restaurants, cuisineCategories } from '../../data/mock';

export default function HomePage() {
  const { fulfillmentType, setFulfillmentType } = useCartStore();

  const popularRestaurants = restaurants.filter((r) => r.isOpen).slice(0, 4);
  const quickPickRestaurants = restaurants.filter((r) => r.hasQuickPick && r.isOpen);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FDF6F0] via-surface to-[#FFF8F0] overflow-hidden">
        <div className="container-app py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-ink leading-tight mb-4">
                Good food,{' '}
                <span className="text-brand-500">ready when you are.</span>
              </h1>
              <p className="text-ink-secondary text-base sm:text-lg mb-6 leading-relaxed">
                Discover local favorites, order for delivery, or skip the queue with QuickPick.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/explore" className="btn-primary text-base px-6 py-3">
                  Explore food <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#quickpick-section" className="btn-secondary text-base px-6 py-3">
                  How QuickPick works
                </a>
              </div>

              {/* Fulfillment card */}
              <div className="card p-4 inline-block">
                <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wide">Order your way</p>
                <FulfillmentToggle
                  value={fulfillmentType}
                  onChange={setFulfillmentType}
                  deliveryTime={30}
                  pickupTime={10}
                />
                <p className="text-xs text-ink-muted mt-2">
                  {fulfillmentType === 'delivery'
                    ? '8 restaurants delivering near you'
                    : '5 QuickPick outlets near you'}
                </p>
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&h=525&fit=crop"
                  alt="Delicious spread of food"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-card shadow-dropdown p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">QuickPick</p>
                  <p className="text-xs text-ink-muted">Ready in 10 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Your Way */}
      <section className="container-app py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5 flex gap-4 items-start">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-1">Delivery</h3>
              <p className="text-sm text-ink-muted">Food delivered to your door in 25-40 minutes. Live tracking included.</p>
            </div>
          </div>
          <div className="card p-5 flex gap-4 items-start border-brand-100 bg-brand-50/30">
            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-1">QuickPick</h3>
              <p className="text-sm text-ink-muted">Order ahead and collect when ready. No queue, no wait. Just pick up and go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="container-app py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Popular cuisines</h2>
          <Link to="/explore" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {cuisineCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?cuisine=${cat.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-brand-300 transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-medium text-ink-secondary group-hover:text-ink transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="container-app py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Popular near you</h2>
          <Link to="/explore" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* QuickPick Section */}
      <section id="quickpick-section" className="bg-gradient-to-br from-brand-50 to-amber-50/50 py-12">
        <div className="container-app">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-brand-500" />
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">QuickPick</span>
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">Skip the queue. Grab and go.</h2>
          <p className="text-ink-muted text-sm mb-6 max-w-lg">
            Order from food trucks, cafes, canteens, and outlets near you. Your food is prepared while you're on your way.
            Show your QR code, collect your order, and leave.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickPickRestaurants.slice(0, 3).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Why FoodCart */}
      <section className="container-app py-12">
        <h2 className="section-title text-center mb-8">Why FoodCart</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: 'Live tracking', desc: 'Track your delivery or pickup preparation in real-time.' },
            { icon: Shield, title: 'Secure payment', desc: 'Pay safely with UPI, cards, wallets, or cash.' },
            { icon: Zap, title: 'Queue-free pickup', desc: 'Order ahead with QuickPick and skip the line.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center px-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-ink-secondary" />
              </div>
              <h3 className="font-semibold text-ink mb-1">{title}</h3>
              <p className="text-sm text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner CTA */}
      <section className="container-app pb-12">
        <div className="card bg-ink text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
          <div>
            <h2 className="text-xl font-bold mb-1">Partner with FoodCart</h2>
            <p className="text-gray-300 text-sm">
              List your restaurant or food truck. Reach more customers with QuickPick.
            </p>
          </div>
          <Link to="/partner/login" className="btn-primary bg-white text-ink hover:bg-gray-100 flex-shrink-0">
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

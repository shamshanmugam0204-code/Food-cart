import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="font-bold text-lg text-white">FoodCart</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Order ahead. Skip the queue. Get your food delivered or pick it up hassle-free with QuickPick.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For You */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">For You</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">QuickPick</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Offers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Partner */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">For Partners</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/partner/login" className="hover:text-white transition-colors">Partner with us</Link></li>
              <li><Link to="/partner/login" className="hover:text-white transition-colors">Restaurant login</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms of service</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy policy</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>2026 FoodCart Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

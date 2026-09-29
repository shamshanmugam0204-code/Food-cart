import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { menuItems } from '../../data/mock';
import { useUIStore } from '../../store';
import { formatPrice, cn } from '../../lib/utils';
import type { MenuItem } from '../../types';

export default function PartnerMenuPage() {
  const { addNotification } = useUIStore();
  const [items, setItems] = useState<MenuItem[]>(menuItems.slice(0, 10));
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item modal state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Main Course');
  const [newIsVeg, setNewIsVeg] = useState(true);
  const [newPrepTime, setNewPrepTime] = useState('15');
  const [newDesc, setNewDesc] = useState('');

  const categories = ['All', 'Biryani', 'Main Course', 'Starters', 'Burgers', 'Beverages', 'Desserts'];

  const filteredItems = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const nextState = !i.isAvailable;
          addNotification({
            type: nextState ? 'success' : 'warning',
            title: `${i.name} is now ${nextState ? 'Available' : 'Sold Out'}`,
          });
          return { ...i, isAvailable: nextState };
        }
        return i;
      })
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const newItem: MenuItem = {
      id: `m-custom-${Date.now()}`,
      restaurantId: 'r1',
      name: newName.trim(),
      description: newDesc.trim() || 'Freshly prepared specialty dish.',
      price: Number(newPrice),
      image: newIsVeg
        ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
      category: newCategory,
      isVeg: newIsVeg,
      prepTime: Number(newPrepTime) || 15,
      isAvailable: true,
      rating: 4.5,
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setNewName('');
    setNewPrice('');
    setNewDesc('');
    addNotification({
      type: 'success',
      title: `Added "${newItem.name}" to menu!`,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Menu Management</h1>
          <p className="text-xs text-slate-500">Configure prices, availability toggles, and kitchen prep times</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap',
                activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="input-field text-xs pl-9 py-1.5 bg-gray-50"
          />
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="card bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Kitchen Prep Time</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={
                              item.isVeg ? 'veg-indicator' : 'nonveg-indicator'
                            }
                          />
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.prepTime} min</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={cn(
                        'flex items-center gap-1.5 font-semibold text-xs transition-colors',
                        item.isAvailable ? 'text-emerald-600' : 'text-slate-400'
                      )}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="w-6 h-6 fill-emerald-600 text-white" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-300" />
                      )}
                      <span>{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() =>
                        addNotification({
                          type: 'info',
                          title: `Edit mode for "${item.name}" enabled (Demo)`,
                        })
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-gray-100 transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card p-6 bg-white max-w-md w-full space-y-4 shadow-modal">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-slate-900 text-sm">Add New Dish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Butter Garlic Naan"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="199"
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={newPrepTime}
                    onChange={(e) => setNewPrepTime(e.target.value)}
                    placeholder="15"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Starters">Starters</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diet Type</label>
                  <select
                    value={newIsVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setNewIsVeg(e.target.value === 'veg')}
                    className="input-field text-xs"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ingredients and culinary notes..."
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-2 font-bold">
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

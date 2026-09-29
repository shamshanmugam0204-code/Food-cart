import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import type { MenuItem, SelectedCustomization } from '../../types';
import { formatPrice, cn } from '../../lib/utils';

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    customizations: SelectedCustomization[],
    specialInstructions?: string
  ) => void;
}

export function CustomizationModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: CustomizationModalProps) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    item.customizations?.forEach((grp) => {
      const defaultOpt = grp.options.find((o) => o.isDefault) || grp.options[0];
      if (defaultOpt) {
        initial[grp.id] = [defaultOpt.id];
      }
    });
    return initial;
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleToggleOption = (
    groupId: string,
    optionId: string,
    maxSelect: number,
    required: boolean
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (maxSelect === 1) {
        return { ...prev, [groupId]: [optionId] };
      }

      if (current.includes(optionId)) {
        if (required && current.length <= 1) return prev;
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      } else {
        if (current.length >= maxSelect) {
          return { ...prev, [groupId]: [...current.slice(1), optionId] };
        }
        return { ...prev, [groupId]: [...current, optionId] };
      }
    });
  };

  const getCustomizationBreakdown = (): SelectedCustomization[] => {
    const list: SelectedCustomization[] = [];
    if (!item.customizations) return list;

    item.customizations.forEach((grp) => {
      const selected = selectedOptions[grp.id] || [];
      selected.forEach((optId) => {
        const opt = grp.options.find((o) => o.id === optId);
        if (opt) {
          list.push({
            groupId: grp.id,
            groupName: grp.name,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price,
          });
        }
      });
    });
    return list;
  };

  const customizationsList = getCustomizationBreakdown();
  const extraTotal = customizationsList.reduce((sum, c) => sum + c.price, 0);
  const itemUnitPrice = item.price + extraTotal;
  const totalPrice = itemUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, customizationsList, specialInstructions.trim() || undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
          />

          {/* Modal / Bottom Sheet */}
          <div className="min-h-full flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-card shadow-modal overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header with image */}
              <div className="relative h-44 sm:h-52 bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow text-ink hover:bg-white flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-3">
                  <span className={item.isVeg ? 'veg-indicator bg-white' : 'nonveg-indicator bg-white'} />
                </div>
              </div>

              {/* Scrollable details */}
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-ink">{item.name}</h3>
                  <p className="text-sm font-semibold text-brand-600 mt-0.5">{formatPrice(item.price)}</p>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">{item.description}</p>
                </div>

                {/* Customization groups */}
                {item.customizations?.map((group) => {
                  const currentSelected = selectedOptions[group.id] || [];

                  return (
                    <div key={group.id} className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-ink">{group.name}</h4>
                        <span className="text-[11px] text-ink-muted font-medium bg-gray-100 px-2 py-0.5 rounded">
                          {group.required ? 'Mandatory' : 'Optional'}
                          {group.maxSelect > 1 && ` (Up to ${group.maxSelect})`}
                        </span>
                      </div>

                      <div className="space-y-2 mt-3">
                        {group.options.map((option) => {
                          const isChecked = currentSelected.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleToggleOption(
                                  group.id,
                                  option.id,
                                  group.maxSelect,
                                  group.required
                                )
                              }
                              className={cn(
                                'w-full flex items-center justify-between p-2.5 rounded-btn border text-left transition-colors text-sm',
                                isChecked
                                  ? 'border-brand-500 bg-brand-50/40 text-ink'
                                  : 'border-gray-200 hover:border-gray-300 text-ink-secondary'
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    'w-4 h-4 rounded flex items-center justify-center border transition-colors',
                                    group.maxSelect === 1 ? 'rounded-full' : 'rounded',
                                    isChecked
                                      ? 'border-brand-500 bg-brand-500 text-white'
                                      : 'border-gray-300 bg-white'
                                  )}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className={isChecked ? 'font-medium' : ''}>{option.name}</span>
                              </div>
                              <span className="text-xs text-ink-muted">
                                {option.price > 0 ? `+${formatPrice(option.price)}` : 'Free'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Special Instructions */}
                <div className="border-t border-gray-100 pt-4">
                  <label htmlFor="instructions" className="block text-sm font-semibold text-ink mb-1.5">
                    Cooking Instructions (Optional)
                  </label>
                  <textarea
                    id="instructions"
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, extra napkins, cutlery required..."
                    className="input-field text-xs resize-none"
                  />
                </div>
              </div>

              {/* Sticky bottom bar */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center border border-gray-200 bg-white rounded-btn shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-ink hover:text-brand-600 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-ink">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-ink hover:text-brand-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-primary flex-1 py-3 text-sm flex items-center justify-between"
                >
                  <span>Add Item</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

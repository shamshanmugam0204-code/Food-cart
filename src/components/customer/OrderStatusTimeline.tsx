import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { StatusUpdate, FulfillmentType } from '../../types';

interface OrderStatusTimelineProps {
  statusHistory: StatusUpdate[];
  currentStatus: string;
  fulfillmentType: FulfillmentType;
}

const deliverySteps = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const pickupSteps = ['placed', 'confirmed', 'preparing', 'ready', 'picked_up'];

const stepLabels: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  picked_up: 'Picked Up',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export function OrderStatusTimeline({ statusHistory, currentStatus, fulfillmentType }: OrderStatusTimelineProps) {
  const steps = fulfillmentType === 'pickup' ? pickupSteps : deliverySteps;
  const currentIdx = steps.indexOf(currentStatus);

  const getStepTime = (step: string) => {
    const entry = statusHistory.find((s) => s.status === step);
    if (!entry) return null;
    const date = new Date(entry.timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-0" role="list" aria-label="Order status timeline">
      {steps.map((step, idx) => {
        const isDone = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === steps.length - 1;
        const time = getStepTime(step);
        const historyEntry = statusHistory.find((s) => s.status === step);

        return (
          <div key={step} className="flex gap-3" role="listitem">
            {/* Line + icon */}
            <div className="flex flex-col items-center">
              {isDone ? (
                <CheckCircle
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isCurrent ? 'text-brand-500' : 'text-emerald-500'
                  )}
                />
              ) : (
                <Circle className="w-5 h-5 flex-shrink-0 text-gray-300" />
              )}
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 h-8 my-1',
                    isDone ? 'bg-emerald-300' : 'bg-gray-200'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-3', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-medium',
                  isDone ? 'text-ink' : 'text-ink-faint',
                  isCurrent && 'text-brand-600'
                )}
              >
                {stepLabels[step]}
                {isCurrent && currentStatus === 'preparing' && (
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full ml-2 animate-pulse-dot" />
                )}
              </p>
              {time && (
                <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {time}
                </p>
              )}
              {historyEntry?.message && isDone && (
                <p className="text-xs text-ink-muted mt-0.5">{historyEntry.message}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

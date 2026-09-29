import { cn } from '../../lib/utils';
import { getStatusLabel, getStatusColor } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md border',
        getStatusColor(status),
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'preparing' && 'bg-amber-500 animate-pulse-dot',
          status === 'ready' && 'bg-emerald-500',
          (status === 'placed' || status === 'confirmed' || status === 'out_for_delivery') && 'bg-blue-500',
          status === 'delivered' && 'bg-emerald-500',
          status === 'picked_up' && 'bg-emerald-500',
          status === 'cancelled' && 'bg-red-500'
        )}
      />
      {getStatusLabel(status)}
    </span>
  );
}

import { cn } from '../../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'card' | 'image';
  lines?: number;
}

export function LoadingSkeleton({ className, variant = 'text', lines = 1 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('card p-4 space-y-3', className)}>
        <div className="skeleton h-40 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return <div className={cn('skeleton rounded-full w-10 h-10', className)} />;
  }

  if (variant === 'image') {
    return <div className={cn('skeleton w-full h-48 rounded-lg', className)} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('skeleton h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-5 w-12 rounded-md" />
        </div>
        <div className="skeleton h-3 w-48" />
        <div className="flex gap-4">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-100">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-4" />
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-3/4" />
      </div>
      <div className="skeleton h-24 w-28 rounded-lg flex-shrink-0" />
    </div>
  );
}

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateOrderNumber = (): string => {
  const num = Math.floor(4000 + Math.random() * 1000);
  return `FC-${num}`;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    picked_up: 'Picked Up',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    placed: 'text-blue-600 bg-blue-50 border-blue-200',
    confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
    preparing: 'text-amber-600 bg-amber-50 border-amber-200',
    ready: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    picked_up: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    out_for_delivery: 'text-blue-600 bg-blue-50 border-blue-200',
    delivered: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[status] || '';
};

export const truncate = (str: string, len: number): string => {
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
};

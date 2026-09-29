import { QRCodeSVG } from 'qrcode.react';
import { Store, Clock, Key, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QRCodeCardProps {
  orderNumber: string;
  otp: string;
  counter?: string;
  estimatedTime?: string;
  restaurantName: string;
  className?: string;
}

export function QRCodeCard({
  orderNumber,
  otp,
  counter = 'Counter 2',
  estimatedTime,
  restaurantName,
  className,
}: QRCodeCardProps) {
  const qrData = JSON.stringify({ orderNumber, otp, outlet: restaurantName, counter });

  return (
    <div className={cn('bg-white border-2 border-brand-200 rounded-card p-5 text-center shadow-card', className)}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold mb-3">
        <Store className="w-3.5 h-3.5" />
        FoodCart QuickPick Pass
      </div>

      <div className="bg-surface p-4 rounded-xl inline-block mx-auto border border-gray-100 mb-3 shadow-inner">
        <QRCodeSVG
          value={qrData}
          size={160}
          level="M"
          includeMargin={false}
          className="mx-auto"
        />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">Order Number</p>
          <p className="text-lg font-bold text-ink tracking-wide">{orderNumber}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 py-2 px-3 rounded-btn inline-block">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-800 font-medium">
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Pickup OTP:</span>
            <span className="text-base font-bold tracking-widest text-ink">{otp}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-around text-xs text-ink-secondary">
          <div className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-brand-500" />
            <span className="font-semibold text-ink">{counter}</span>
          </div>
          {estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Ready by <span className="font-semibold text-ink">{estimatedTime}</span></span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Show this QR or share OTP at the counter to collect food.</span>
      </div>
    </div>
  );
}

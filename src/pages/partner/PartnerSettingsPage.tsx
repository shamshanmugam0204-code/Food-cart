import { useState } from 'react';
import { Store, Clock, Bell, Shield, Save } from 'lucide-react';
import { useUIStore } from '../../store';

export default function PartnerSettingsPage() {
  const { addNotification } = useUIStore();

  const [counterName, setCounterName] = useState('Counter 2');
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [prepBuffer, setPrepBuffer] = useState('15');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoBusyThreshold, setAutoBusyThreshold] = useState('8');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      type: 'success',
      title: 'Outlet settings saved successfully!',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Outlet Settings</h1>
        <p className="text-xs text-slate-500">Configure pickup counter identity, operational hours, and alerts</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 bg-white border border-gray-200 space-y-6">
        {/* QuickPick Configuration */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store className="w-4 h-4 text-brand-600" />
            QuickPick Counter Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Pickup Counter
              </label>
              <input
                type="text"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                placeholder="e.g. Counter 2 or Window 1"
                className="input-field text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed to customers on their order confirmation and live pass.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Preparation Buffer (Minutes)
              </label>
              <input
                type="number"
                value={prepBuffer}
                onChange={(e) => setPrepBuffer(e.target.value)}
                className="input-field text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Base time communicated to customers before food is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Clock className="w-4 h-4 text-brand-600" />
            Operational Hours
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opening Time
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Closing Time
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </div>
        </div>

        {/* Kitchen Automation & Sounds */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Bell className="w-4 h-4 text-brand-600" />
            Kitchen Notifications
          </h2>
          <div className="space-y-3 mt-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Play Audio Bell on New Order</p>
                <p className="text-[11px] text-slate-400">
                  Rings kitchen tablet speaker when customer places an order.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Auto-Mark Busy on Rush</p>
                <p className="text-[11px] text-slate-400">
                  Switch to Busy mode if active queue exceeds {autoBusyThreshold} orders.
                </p>
              </div>
              <input
                type="number"
                value={autoBusyThreshold}
                onChange={(e) => setAutoBusyThreshold(e.target.value)}
                className="input-field w-20 text-xs py-1"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}

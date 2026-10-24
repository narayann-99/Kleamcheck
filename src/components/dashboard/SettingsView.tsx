import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Store,
  Bell,
  Lock,
  KeyRound,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const SettingsView: React.FC = () => {
  const [storeName, setStoreName] = useState('CleanStore Retail');
  const [upiHandle, setUpiHandle] = useState('cleanstore@icici');
  const [alertOnDuplicate, setAlertOnDuplicate] = useState(true);
  const [alertOnMismatch, setAlertOnMismatch] = useState(true);
  const [alertHighRisk, setAlertHighRisk] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your store handles, notification preferences, and verification policies.
        </p>
      </div>

      {saveToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local demo settings updated successfully for this session.</span>
        </div>
      )}

      {/* Integration Status Alert Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Payment-Provider Integration Status
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Not Connected
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              CleanCheck operates currently as an evidence-analysis MVP. Direct bank settlement reconciliation requires an authorized gateway or aggregator webhook (Razorpay, Cashfree, or Open Banking API).
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              * In the production phase, API webhooks will match UTR bank settlement records automatically.
            </div>
          </div>
        </div>
      </div>

      {/* Store Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Store className="w-4 h-4 text-orange-600" />
          <h3 className="text-base font-semibold text-slate-900">Store Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Merchant Business Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Primary Settlement UPI ID</label>
            <input
              type="text"
              value={upiHandle}
              onChange={(e) => setUpiHandle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-slate-900 text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">Used to verify receipt payee consistency.</p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-semibold text-slate-900">Review Notifications</h4>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900 block">Duplicate Receipt Alerts</span>
                <span className="text-slate-500 text-[11px]">Flag when an image matches previous orders</span>
              </div>
              <input
                type="checkbox"
                checked={alertOnDuplicate}
                onChange={(e) => setAlertOnDuplicate(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900 block">Amount Mismatch Warnings</span>
                <span className="text-slate-500 text-[11px]">Notify when receipt differs from expected order total</span>
              </div>
              <input
                type="checkbox"
                checked={alertOnMismatch}
                onChange={(e) => setAlertOnMismatch(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900 block">Critical Risk Block</span>
                <span className="text-slate-500 text-[11px]">Hold automated dispatch queue for high-concern scans</span>
              </div>
              <input
                type="checkbox"
                checked={alertHighRisk}
                onChange={(e) => setAlertHighRisk(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Privacy and Data-Handling Notice */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Lock className="w-3.5 h-3.5 text-orange-600" />
          <span>Security & Data Handling Standard</span>
        </div>
        <p className="leading-relaxed">
          CleanCheck enforces strict privacy: raw customer screenshots are decoded in browser sandbox memory, evaluated for cryptographic and perceptual hashes, and not retained on remote servers during the frontend demonstration phase.
        </p>
      </div>
    </div>
  );
};

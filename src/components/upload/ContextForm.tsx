import React from 'react';
import { OrderContext, DemoPreset } from '../../types';
import { parseAmount } from '../../lib/rules';
import { Sparkles, Hash, IndianRupee, AtSign } from 'lucide-react';
import { DEMO_PRESETS } from '../../lib/demo/mockData';

interface ContextFormProps {
  context: OrderContext;
  onChange: (updated: OrderContext) => void;
  onSelectPreset?: (preset: DemoPreset) => void;
  disabled?: boolean;
}

export const ContextForm: React.FC<ContextFormProps> = ({
  context,
  onChange,
  onSelectPreset,
  disabled = false,
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsed = parseAmount(val);
    onChange({
      ...context,
      expectedAmount: parsed !== null ? parsed : undefined,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Expected Order Context (Optional)
          </h4>
          <p className="text-xs text-slate-500">
            Provide details to cross-check extracted receipt figures against your intended order.
          </p>
        </div>
      </div>

      {/* Preset Quick Loaders */}
      {onSelectPreset && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Quick Test Presets (Instant Simulation)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                disabled={disabled}
                className="text-left p-2 rounded-lg bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 transition-all text-xs cursor-pointer group"
              >
                <div className="font-medium text-slate-900 group-hover:text-orange-600 truncate">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {preset.badge}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Expected Amount */}
        <div>
          <label htmlFor="expected-amount" className="block text-xs font-medium text-slate-700 mb-1">
            Expected Amount (INR)
          </label>
          <div className="relative rounded-lg shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="number"
              id="expected-amount"
              min="0"
              step="0.01"
              value={context.expectedAmount ?? ''}
              onChange={handleAmountChange}
              disabled={disabled}
              placeholder="e.g. 2450.00"
              className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Disallows negative amounts. Formatted in ₹.</p>
        </div>

        {/* Order ID */}
        <div>
          <label htmlFor="order-id" className="block text-xs font-medium text-slate-700 mb-1">
            Order Reference ID
          </label>
          <div className="relative rounded-lg shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              id="order-id"
              value={context.orderId ?? ''}
              onChange={(e) => onChange({ ...context, orderId: e.target.value })}
              disabled={disabled}
              placeholder="e.g. ORD-9021"
              className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Used to log evidence against this specific order.</p>
        </div>

        {/* Expected Recipient Name / UPI ID */}
        <div>
          <label htmlFor="expected-recipient" className="block text-xs font-medium text-slate-700 mb-1">
            Expected Store / Recipient UPI Handle
          </label>
          <div className="relative rounded-lg shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <AtSign className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              id="expected-recipient"
              value={context.expectedRecipient ?? ''}
              onChange={(e) => onChange({ ...context, expectedRecipient: e.target.value })}
              disabled={disabled}
              placeholder="e.g. cleanstore@icici"
              className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* Expected Txn Reference (UTR) */}
        <div>
          <label htmlFor="expected-reference" className="block text-xs font-medium text-slate-700 mb-1">
            Expected UTR / Bank Reference (Optional)
          </label>
          <input
            type="text"
            id="expected-reference"
            value={context.expectedReference ?? ''}
            onChange={(e) => onChange({ ...context, expectedReference: e.target.value })}
            disabled={disabled}
            placeholder="12-digit UTR if already communicated"
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};

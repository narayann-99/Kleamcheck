import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, Eye, AlertTriangle, IndianRupee } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ReportPreviewCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 max-w-md w-full relative overflow-hidden select-none">
      {/* Top Tag & Demo Label */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Badge variant="orange" size="sm">
            DEMO REPORT
          </Badge>
          <span className="text-xs text-slate-400 font-mono">SCAN-8491</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Just now</span>
        </div>
      </div>

      {/* Main Extracted Metric */}
      <div className="my-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
            Extracted Amount
          </span>
          <div className="flex items-center text-3xl font-bold tracking-tight text-slate-900">
            <IndianRupee className="w-6 h-6 stroke-[2.5] inline-block mr-0.5 text-slate-900" />
            <span>2,450.00</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Analysis Status</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Checks Complete
          </span>
        </div>
      </div>

      {/* Mandatory Trust & Confirmation Callout */}
      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-4">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-amber-950">Payment confirmation: Unverified</span>
          <span className="text-[11px] text-amber-800 leading-snug block mt-0.5">
            Screenshot evidence verified for visual consistency. Independent bank credit confirmation is not included in this MVP.
          </span>
        </div>
      </div>

      {/* Findings preview */}
      <div className="space-y-2 mb-4">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-800">Amount matches expected order</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">Exact</span>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-slate-800">Similar receipt signature check</span>
          </div>
          <span className="text-[10px] text-amber-700 font-mono bg-amber-50 px-1.5 py-0.5 rounded">Clean (0 Collisions)</span>
        </div>
      </div>

      {/* Extracted Details Mini Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Payment App</span>
          <span className="text-slate-800 font-medium">Google Pay UPI</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">UTR Reference</span>
          <span className="text-slate-800 font-mono">429812904812</span>
        </div>
      </div>

      {/* Illustrative preview disclaimer */}
      <div className="mt-3 text-center">
        <span className="text-[10px] text-slate-400 italic">
          * Illustrated with sample CleanCheck evidence analysis data.
        </span>
      </div>
    </div>
  );
};

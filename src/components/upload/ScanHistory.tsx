import React from 'react';
import { ScanReport } from '../../types';
import { formatINR } from '../../lib/rules';
import { RiskBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  History,
  Trash2,
  Clock,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
} from 'lucide-react';

interface ScanHistoryProps {
  scans: ScanReport[];
  onSelectScan: (scan: ScanReport) => void;
  onRemoveScan: (scanId: string) => void;
  onClearAll: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  scans,
  onSelectScan,
  onRemoveScan,
  onClearAll,
}) => {
  if (scans.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900 mb-1">
          No Recent Screenshot Verifications
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Screenshots you analyze will be safely stored in your browser's local storage so you can easily revisit previous findings without re-uploading.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Verification History</h3>
              <span className="text-[11px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                {scans.length} {scans.length === 1 ? 'Scan' : 'Scans'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Saved in local browser memory. Click any result to revisit full evidence report.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors flex items-center gap-1 cursor-pointer p-1"
          title="Clear all stored local history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      {/* List of Recent Scans */}
      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
        {scans.map((scan) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan(scan)}
            className="p-4 hover:bg-orange-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
          >
            {/* Left Info */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 group-hover:border-orange-300 group-hover:text-orange-600 transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {scan.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 truncate max-w-[200px]" title={scan.filename}>
                    {scan.filename}
                  </span>
                  {scan.contextProvided?.orderId && (
                    <span className="text-[10px] font-mono font-medium bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                      {scan.contextProvided.orderId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {scan.createdAt}
                  </span>
                  <span>•</span>
                  <span>{scan.extractedFields.paymentApp || 'UPI App'}</span>
                  {scan.extractedFields.referenceNumber && (
                    <>
                      <span>•</span>
                      <span className="font-mono">UTR: {scan.extractedFields.referenceNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Meta & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <div className="flex items-center text-sm font-bold text-slate-900 font-sans sm:justify-end">
                  <IndianRupee className="w-3.5 h-3.5 mr-0.5 inline-block text-slate-900 shrink-0 stroke-[2.5]" />
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(scan.extractedFields.amount || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 sm:justify-end">
                  <RiskBadge level={scan.riskLevel} />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectScan(scan);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 group-hover:bg-orange-600 text-slate-700 group-hover:text-white rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Revisit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveScan(scan.id);
                  }}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete from history"
                  aria-label={`Remove scan ${scan.id} from history`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

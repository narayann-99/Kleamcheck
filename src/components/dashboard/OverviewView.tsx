import React from 'react';
import { MerchantStats, ScanReport, MerchantOrder } from '../../types';
import { formatINR } from '../../lib/rules';
import { RiskBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  SearchCheck,
  Plus,
  AlertTriangle,
  History,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

interface OverviewViewProps {
  stats: MerchantStats;
  scans: ScanReport[];
  orders: MerchantOrder[];
  onOpenCreateOrder: () => void;
  onGoToChecker: () => void;
  onSelectScan: (scan: ScanReport) => void;
  onSelectTab: (tab: 'overview' | 'orders' | 'scans' | 'settings') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  scans,
  orders,
  onOpenCreateOrder,
  onGoToChecker,
  onSelectScan,
  onSelectTab,
}) => {
  const recentScans = scans.slice(0, 5);
  const flaggedQueue = scans.filter((s) => s.riskLevel === 'high' || s.riskLevel === 'critical');

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review submitted receipts, identify repeated evidence and keep order checks organized.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={onOpenCreateOrder} leftIcon={<Plus className="w-4 h-4" />}>
            Create Order
          </Button>
          <Button variant="primary" size="sm" onClick={onGoToChecker} leftIcon={<SearchCheck className="w-4 h-4" />}>
            Analyze Screenshot
          </Button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {stats.totalScans}
            </span>
            <span className="text-xs text-emerald-600 font-medium">+14 this week</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Sample demo ledger count</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Flagged Receipts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">
              {stats.flaggedReceipts}
            </span>
            <span className="text-xs text-rose-600 font-medium">Needs attention</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Inconsistent amounts or recipient</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Possible Duplicates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
              {stats.possibleDuplicates}
            </span>
            <span className="text-xs text-amber-700 font-medium">Recycled images</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Perceptual hash collision match</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders Awaiting Review</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {stats.ordersAwaitingReview}
            </span>
            <span className="text-xs text-slate-500 font-medium">Pending proof</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Active customer queue</div>
        </div>
      </div>

      {/* Risk Review Queue Alert if high concern items exist */}
      {flaggedQueue.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-semibold text-slate-900">
                Risk Review Queue ({flaggedQueue.length} High Concern Scans)
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('scans')}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
            >
              View all scans <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectScan(item)}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {item.contextProvided?.orderId || item.id}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">{item.filename}</span>
                  </div>
                  <RiskBadge level={item.riskLevel} />
                </div>
                <div className="text-xs text-slate-700 line-clamp-2">
                  {item.findings[0]?.explanation || item.recommendedAction}
                </div>
                <div className="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(item.extractedFields.amount)}
                  </span>
                  <span className="text-orange-600 font-medium group-hover:underline">Inspect finding &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scan Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Recent Scan Activity</h3>
            <p className="text-xs text-slate-500">Latest payment screenshot verification runs</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onSelectTab('scans')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Full History
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Receipt Amount</th>
                <th className="py-3 px-4">Findings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {scan.createdAt}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                    {scan.contextProvided?.orderId || 'Direct Scan'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                    {formatINR(scan.extractedFields.amount)}
                  </td>
                  <td className="py-3 px-4">
                    {scan.findings.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> {scan.findings.length} issue(s)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Consistent</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={scan.analysisStatus} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectScan(scan)}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-800 cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

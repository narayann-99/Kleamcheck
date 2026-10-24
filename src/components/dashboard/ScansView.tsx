import React, { useState } from 'react';
import { ScanReport } from '../../types';
import { formatINR } from '../../lib/rules';
import { RiskBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Search,
  Filter,
  History,
  X,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ScanReportView } from '../reports/ScanReportView';

interface ScansViewProps {
  scans: ScanReport[];
  onGoToChecker: () => void;
  selectedScan?: ScanReport | null;
  onClearSelectedScan?: () => void;
  onSelectScan: (scan: ScanReport) => void;
}

export const ScansView: React.FC<ScansViewProps> = ({
  scans,
  onGoToChecker,
  selectedScan,
  onClearSelectedScan,
  onSelectScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredScans = scans.filter((scan) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      scan.id.toLowerCase().includes(term) ||
      (scan.contextProvided?.orderId && scan.contextProvided.orderId.toLowerCase().includes(term)) ||
      (scan.extractedFields.referenceNumber && scan.extractedFields.referenceNumber.toLowerCase().includes(term)) ||
      scan.filename.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'all' || scan.analysisStatus === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' ||
      scan.findings.some((f) => f.category === categoryFilter) ||
      (categoryFilter === 'duplicates' && scan.duplicateMatch.isMatch);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* If a scan is selected for slide-over inspection */}
      {selectedScan ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              onClick={onClearSelectedScan}
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 inline-flex items-center gap-1 cursor-pointer"
            >
              &larr; Back to Scan Ledger
            </button>
            <span className="text-xs text-slate-400 font-mono">Viewing {selectedScan.id}</span>
          </div>

          <ScanReportView
            report={selectedScan}
            onReset={onClearSelectedScan || (() => {})}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scan History & Audit</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Audit trail of all screenshot evidence runs, hashes, and risk assessments.
              </p>
            </div>

            <Button variant="primary" size="sm" onClick={onGoToChecker}>
              Analyze New Screenshot
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID, UTR reference, filename..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 cursor-pointer"
                >
                  <option value="all">All Findings</option>
                  <option value="duplicates">Duplicates Only</option>
                  <option value="amount_mismatch">Amount Mismatches</option>
                  <option value="recipient_mismatch">Recipient Mismatches</option>
                  <option value="reference_reuse">Reference Reuses</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="no_issue_detected">Consistent Checks</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="high_concern">High Concern</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredScans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Scan Ref & Time</th>
                      <th className="py-3 px-4">Order Context</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">UTR Reference</th>
                      <th className="py-3 px-4">Risk & Findings</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{scan.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{scan.createdAt}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {scan.contextProvided?.orderId || 'Ad-hoc Scan'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {formatINR(scan.extractedFields.amount)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {scan.extractedFields.referenceNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <RiskBadge level={scan.riskLevel} />
                            {scan.findings.length > 0 && (
                              <span className="text-[11px] text-slate-500">
                                ({scan.findings.length})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={scan.analysisStatus} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectScan(scan)}
                            className="text-xs font-semibold text-orange-600 hover:text-orange-800 cursor-pointer inline-flex items-center gap-1"
                          >
                            Inspect <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No scans match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing the category or status filters to display all recorded receipt scans.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

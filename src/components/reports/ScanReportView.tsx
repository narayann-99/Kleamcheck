import React from 'react';
import { ScanReport } from '../../types';
import { formatINR } from '../../lib/rules';
import { RiskBadge, StatusBadge, Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Layers,
  ArrowLeft,
  FileCheck2,
  CopyCheck,
  ExternalLink,
  Info,
  IndianRupee,
} from 'lucide-react';

interface ScanReportViewProps {
  report: ScanReport;
  onReset: () => void;
  onGoToMerchant?: () => void;
}

export const ScanReportView: React.FC<ScanReportViewProps> = ({
  report,
  onReset,
  onGoToMerchant,
}) => {
  const {
    id,
    createdAt,
    mode,
    filename,
    previewUrl,
    analysisStatus,
    paymentConfirmation,
    riskLevel,
    extractedFields,
    contextProvided,
    duplicateMatch,
    checks,
    findings,
    recommendedAction,
  } = report;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onReset} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            New Scan
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Payment Evidence Report
              </h2>
              <Badge variant="orange" size="sm">
                {mode === 'demo' ? 'DEMO ANALYSIS' : 'LIVE REPORT'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span className="font-mono font-medium text-slate-700">{id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {createdAt}
              </span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{filename}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={riskLevel} />
          <StatusBadge status={analysisStatus} />
        </div>
      </div>

      {/* Mandatory Prominent Unverified Notice */}
      <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 sm:p-5 text-amber-950 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-900">
                Payment Confirmation: {paymentConfirmation.toUpperCase()}
              </h3>
              <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded">
                EVIDENCE ONLY
              </span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              CleanCheck analyzes image artifacts, OCR text alignment, and duplicate registries. This report does <strong>NOT</strong> independently prove or guarantee that funds have settled into your bank account. Independent confirmation requires checking your official banking app or payment provider settlement feed.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Extracted Amount Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Extracted Amount
            </span>
            <div className="mt-2 flex items-center gap-1">
              <IndianRupee className="w-6 h-6 stroke-[2.5] text-slate-900 shrink-0" />
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(extractedFields.amount || 0)}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">INR</span>
            </div>

            {contextProvided?.expectedAmount !== undefined && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span>Expected Order Total:</span>
                  <span className="font-medium text-slate-900 inline-flex items-center">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-700 stroke-[2.2]" />
                    <span>
                      {new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(contextProvided.expectedAmount)}
                    </span>
                  </span>
                </div>
                {Math.abs((extractedFields.amount || 0) - contextProvided.expectedAmount) < 0.05 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Exact Amount Match
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <AlertOctagon className="w-3 h-3" /> Discrepancy of{' '}
                    {formatINR(Math.abs((extractedFields.amount || 0) - contextProvided.expectedAmount))}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>OCR Quality</span>
            <span className="font-mono font-medium text-slate-700">
              {Math.round(extractedFields.ocrConfidence * 100)}% Confidence
            </span>
          </div>
        </div>

        {/* Duplicate & Similarity Radar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Duplicate Detection
            </span>
            <div className="mt-2">
              {duplicateMatch.isMatch ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Duplicate Screenshot Detected</span>
                  </div>
                  <p className="text-xs text-rose-900/90 leading-normal">
                    Matches prior upload from{' '}
                    <span className="font-semibold">{duplicateMatch.previousTimestamp || 'previous order'}</span>{' '}
                    ({duplicateMatch.similarityPercentage}% visual similarity).
                  </p>
                  {duplicateMatch.previousOrderId && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200/80 text-slate-600">
                      Prior associated order: <span className="font-mono font-bold text-slate-900">{duplicateMatch.previousOrderId}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No Prior Match Found</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    This image fingerprint and reference number has not appeared in your prior scan registry.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Perceptual Signature</span>
            <span className="font-mono text-slate-700">DCT Hash (64-bit)</span>
          </div>
        </div>

        {/* Recommended Action Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recommended Action
            </span>
            <div className="mt-2 text-xs text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-900 mb-1">{recommendedAction}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Risk Assessment</span>
            <span className="text-xs font-semibold capitalize text-slate-800">
              {riskLevel} Risk Level
            </span>
          </div>
        </div>
      </div>

      {/* Main Extracted Receipt Details Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-semibold text-slate-900">Extracted Evidence Fields</h3>
          </div>
          <span className="text-xs text-slate-400">Extracted from image text</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              Payment Application
            </span>
            <span className="text-slate-900 font-semibold text-sm">
              {extractedFields.paymentApp || 'Unknown UPI Application'}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              UTR / Bank Transaction Reference
            </span>
            <span className="text-slate-900 font-mono font-semibold text-sm select-all">
              {extractedFields.referenceNumber || 'Unreadable in screenshot'}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              Receipt Date & Timestamp
            </span>
            <span className="text-slate-900 font-medium">
              {extractedFields.date} {extractedFields.time ? `• ${extractedFields.time}` : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              Recipient Store / Name
            </span>
            <span className="text-slate-900 font-medium">
              {extractedFields.recipientName || 'Not detected'}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              Recipient UPI ID
            </span>
            <span className="text-slate-900 font-mono font-medium truncate block">
              {extractedFields.recipientUpiId || 'Not detected'}
            </span>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium mb-1 uppercase tracking-wider text-[10px]">
              Sender Account / UPI
            </span>
            <span className="text-slate-900 font-medium">
              {extractedFields.senderName || extractedFields.senderUpiId || 'Hidden by payment app'}
            </span>
          </div>
        </div>
      </div>

      {/* Findings List (Issues / Warnings) */}
      {findings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-semibold text-slate-900">
                Identified Findings & Inconsistencies ({findings.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Requires merchant review</span>
          </div>

          <div className="space-y-3">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className={`p-4 rounded-xl border text-xs ${
                  finding.severity === 'danger'
                    ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                    : 'bg-amber-50/60 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {finding.severity === 'danger' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <h4 className="font-bold text-sm text-slate-900">{finding.title}</h4>
                  </div>
                  <Badge
                    variant={finding.severity === 'danger' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {finding.severity}
                  </Badge>
                </div>

                <p className="text-slate-700 leading-relaxed mb-2">{finding.explanation}</p>

                <div className="p-2.5 bg-white/80 rounded-lg border border-slate-200/60 space-y-1">
                  <div className="text-[11px] text-slate-500 font-mono">
                    <span className="font-semibold text-slate-700">Evidence: </span>
                    {finding.evidenceDescription}
                  </div>
                  <div className="text-[11px] text-slate-800">
                    <span className="font-semibold text-orange-700">Recommended Action: </span>
                    {finding.recommendedAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Systematic Verification Checks Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-semibold text-slate-900">Verification Checks Performed</h3>
          </div>
          <span className="text-xs text-slate-400">Automated Pipeline</span>
        </div>

        <div className="divide-y divide-slate-100">
          {checks.map((check) => (
            <div key={check.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{check.name}</span>
                  <span className="text-slate-400 text-[11px]">({check.description})</span>
                </div>
                <p className="text-slate-500">{check.details}</p>
              </div>

              <div className="shrink-0">
                {check.status === 'passed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passed
                  </span>
                )}
                {check.status === 'warning' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Warning
                  </span>
                )}
                {check.status === 'failed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <AlertOctagon className="w-3 h-3 text-rose-600" /> Inconsistent
                  </span>
                )}
                {check.status === 'skipped' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    <Info className="w-3 h-3 text-slate-400" /> Skipped
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview & Download / Review Action */}
      {previewUrl && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
              <img
                src={previewUrl}
                alt="Analyzed screenshot thumbnail"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block truncate max-w-xs sm:max-w-md">
                Analyzed Screenshot Asset: {filename}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ephemeral browser preview. Object URL revoked upon new analysis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onReset}>
              Analyze Another
            </Button>
            {onGoToMerchant && (
              <Button
                variant="primary"
                size="sm"
                onClick={onGoToMerchant}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Go to Merchant Scans
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

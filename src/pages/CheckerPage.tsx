import React, { useState, useEffect } from 'react';
import { OrderContext, ScanReport, DemoPreset } from '../types';
import { UploadZone } from '../components/upload/UploadZone';
import { ContextForm } from '../components/upload/ContextForm';
import { ScanReportView } from '../components/reports/ScanReportView';
import { ScanHistory } from '../components/upload/ScanHistory';
import { analyzeScreenshot } from '../lib/api/client';
import {
  saveScanToStorage,
  getScanHistoryFromStorage,
  removeScanFromStorage,
  clearScanHistoryFromStorage,
} from '../lib/storage';
import { Button } from '../components/ui/Button';
import {
  SearchCheck,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sparkles,
  History,
  ArrowLeft,
} from 'lucide-react';

interface CheckerPageProps {
  initialContext?: OrderContext;
  onGoToMerchant?: () => void;
}

export const CheckerPage: React.FC<CheckerPageProps> = ({
  initialContext,
  onGoToMerchant,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>(undefined);
  const [context, setContext] = useState<OrderContext>(initialContext || {});
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);

  // Active view tab: 'checker' | 'history'
  const [activeTab, setActiveTab] = useState<'checker' | 'history'>('checker');

  // Stored local scans history
  const [localHistory, setLocalHistory] = useState<ScanReport[]>([]);
  const [isViewingHistoryItem, setIsViewingHistoryItem] = useState(false);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [report, setReport] = useState<ScanReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load scan history from localStorage on mount
  useEffect(() => {
    const saved = getScanHistoryFromStorage();
    setLocalHistory(saved);
  }, []);

  useEffect(() => {
    if (initialContext) {
      setContext(initialContext);
      setActiveTab('checker');
    }
  }, [initialContext]);

  // Clean up object URLs
  const handleClear = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setDimensions(undefined);
    setActivePresetId(undefined);
    setReport(null);
    setIsViewingHistoryItem(false);
    setErrorMessage(null);
  };

  const handleImageSelected = (
    file: File,
    url: string,
    dims?: { width: number; height: number }
  ) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(url);
    setDimensions(dims);
    setActivePresetId(undefined); // custom file chosen
    setErrorMessage(null);
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    const dummyFile = new File(['mock-image-payload'], preset.filename, {
      type: 'image/png',
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="700" viewBox="0 0 400 700">
      <rect width="400" height="700" fill="#F8FAFC"/>
      <rect x="20" y="20" width="360" height="660" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
      <circle cx="200" cy="120" r="40" fill="#EA580C"/>
      <text x="200" y="128" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle">₹</text>
      <text x="200" y="200" font-family="Arial" font-size="20" font-weight="bold" fill="#0F172A" text-anchor="middle">${preset.mockExtracted.formattedAmount}</text>
      <text x="200" y="230" font-family="Arial" font-size="12" fill="#15803D" font-weight="bold" text-anchor="middle">Payment Successful</text>
      <line x1="40" y1="260" x2="360" y2="260" stroke="#E2E8F0" stroke-width="1"/>
      <text x="50" y="290" font-family="Arial" font-size="11" fill="#64748B">To: ${preset.mockExtracted.recipientName}</text>
      <text x="50" y="315" font-family="Arial" font-size="11" font-weight="bold" fill="#0F172A">${preset.mockExtracted.recipientUpiId}</text>
      <text x="50" y="350" font-family="Arial" font-size="11" fill="#64748B">UPI Ref ID:</text>
      <text x="50" y="375" font-family="monospace" font-size="12" fill="#0F172A">${preset.mockExtracted.referenceNumber}</text>
      <rect x="50" y="420" width="300" height="40" rx="8" fill="#FFF7ED"/>
      <text x="200" y="445" font-family="Arial" font-size="11" font-weight="bold" fill="#EA580C" text-anchor="middle">${preset.mockExtracted.paymentApp}</text>
    </svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    setSelectedFile(dummyFile);
    setPreviewUrl(dataUrl);
    setDimensions({ width: 1080, height: 1920 });
    setContext(preset.context);
    setActivePresetId(preset.id);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) {
      setErrorMessage('Please upload or select a screenshot image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    setAnalysisStep('Decoding image container & EXIF tags...');
    await new Promise((r) => setTimeout(r, 350));
    setAnalysisStep('Scanning OCR text and bounding boxes...');
    await new Promise((r) => setTimeout(r, 450));
    setAnalysisStep('Computing perceptual DCT hash (duplicate check)...');
    await new Promise((r) => setTimeout(r, 400));
    setAnalysisStep('Evaluating order context & discrepancy rules...');

    try {
      const result = await analyzeScreenshot({
        file: selectedFile,
        previewUrl,
        context,
        presetId: activePresetId,
      });

      // Save to localStorage history
      const updatedHistory = saveScanToStorage(result);
      setLocalHistory(updatedHistory);

      setReport(result);
      setIsViewingHistoryItem(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSelectFromHistory = (scan: ScanReport) => {
    setReport(scan);
    setIsViewingHistoryItem(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFromHistory = (scanId: string) => {
    const updated = removeScanFromStorage(scanId);
    setLocalHistory(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Clear all locally saved screenshot verification history?')) {
      clearScanHistoryFromStorage();
      setLocalHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* If Report is ready, render the full ScanReportView */}
      {report ? (
        <div className="space-y-4">
          {isViewingHistoryItem && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-orange-950 animate-in fade-in">
              <span className="flex items-center gap-1.5 font-medium">
                <History className="w-4 h-4 text-orange-600" />
                Viewing historical verification result saved in browser local storage ({report.id})
              </span>
              <button
                onClick={handleClear}
                className="font-semibold text-orange-700 hover:text-orange-900 underline underline-offset-2 cursor-pointer"
              >
                Return to Checker
              </button>
            </div>
          )}

          <ScanReportView
            report={report}
            onReset={handleClear}
            onGoToMerchant={onGoToMerchant}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Page Heading - Centre Aligned */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-800">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Evidence Analysis Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
              Analyze a payment screenshot
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed text-center">
              Upload a receipt to inspect visible details, detect duplicate files, and revisit previous verification runs.
            </p>
          </div>

          {/* Section Switcher Tabs (New Upload vs Recent History) */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('checker')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
                  activeTab === 'checker'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SearchCheck className="w-4 h-4 text-orange-600" />
                <span>Upload & Check</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-4 h-4 text-orange-600" />
                <span>Scan History</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    localHistory.length > 0
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {localHistory.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tab 1: Upload & Check Flow */}
          {activeTab === 'checker' ? (
            <div className="space-y-6">
              {/* Quick Notice Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    <strong>Demo Mode Active:</strong> Analysis runs client-side with simulated OCR and hash registry. Verified results are saved locally.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:inline">
                  SHA-256 + pHash
                </span>
              </div>

              {/* Upload Zone Card */}
              <UploadZone
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                dimensions={dimensions}
                onImageSelected={handleImageSelected}
                onClear={handleClear}
                disabled={isAnalyzing}
              />

              {/* Optional Context Form with Quick Presets */}
              <ContextForm
                context={context}
                onChange={setContext}
                onSelectPreset={handleSelectPreset}
                disabled={isAnalyzing}
              />

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block text-sm mb-0.5">Analysis Unavailable</span>
                    <p>{errorMessage}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setErrorMessage(null)}>
                    Dismiss
                  </Button>
                </div>
              )}

              {/* Main Action Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  {selectedFile ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Ready to analyze 1 screenshot asset.
                    </span>
                  ) : (
                    <span>Select or drop a screenshot above to enable analysis.</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {selectedFile && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleClear}
                      disabled={isAnalyzing}
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    isLoading={isAnalyzing}
                    leftIcon={<SearchCheck className="w-5 h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Analyze Screenshot
                  </Button>
                </div>
              </div>

              {/* Analysis Loading Modal / Overlay */}
              {isAnalyzing && (
                <div className="p-6 bg-orange-50/80 border border-orange-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <div className="w-10 h-10 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h4 className="text-sm font-bold text-slate-900">Evaluating Screenshot Evidence</h4>
                  <p className="text-xs text-orange-700 font-mono animate-pulse">{analysisStep}</p>
                  <div className="text-[11px] text-slate-400">
                    Checking perceptual image fingerprints and expected parameters...
                  </div>
                </div>
              )}

              {/* Recent Scan History Quick Preview under Upload */}
              {localHistory.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <ScanHistory
                    scans={localHistory}
                    onSelectScan={handleSelectFromHistory}
                    onRemoveScan={handleRemoveFromHistory}
                    onClearAll={handleClearAllHistory}
                  />
                </div>
              )}

              {/* Helpful Sample Instructions */}
              <div className="border border-slate-200/80 rounded-2xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Tips for accurate analysis</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
                  <li className="p-2.5 bg-slate-50 rounded-lg">
                    <strong className="text-slate-800 block mb-0.5">Full Screenshot</strong>
                    Ensure the entire mobile payment screen is visible, including the status banner and UTR reference number.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-lg">
                    <strong className="text-slate-800 block mb-0.5">High Resolution</strong>
                    Avoid blurry compressed screenshots forwarded through multiple chat applications.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-lg">
                    <strong className="text-slate-800 block mb-0.5">Context Cross-Check</strong>
                    Enter your expected order amount in INR to catch altered numbers or missing zeros automatically.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* Tab 2: Full Scan History List */
            <div className="space-y-4">
              <ScanHistory
                scans={localHistory}
                onSelectScan={handleSelectFromHistory}
                onRemoveScan={handleRemoveFromHistory}
                onClearAll={handleClearAllHistory}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

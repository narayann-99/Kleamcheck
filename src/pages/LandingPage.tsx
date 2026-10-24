import React from 'react';
import {
  ShieldCheck,
  SearchCheck,
  Sparkles,
  ArrowRight,
  Copy,
  Scale,
  History,
  AlertTriangle,
  Store,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ReportPreviewCard } from '../components/reports/ReportPreviewCard';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onOpenHowItWorks?: (mode?: 'user' | 'dev') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenHowItWorks }) => {
  return (
    <div className="py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* 1. Hero Section (Centre Aligned & Focused) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold tracking-wider text-orange-800 uppercase shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
          Payment Evidence Intelligence
        </div>

        {/* Heading - Centre Aligned */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-center">
          A screenshot isn't proof.{' '}
          <span className="text-orange-600 block sm:inline">Check the evidence.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-center">
          Analyze payment screenshots, detect recycled duplicate receipts, and inspect inconsistent details in seconds.
        </p>

        {/* Essential CTAs Only: 1) Analyze Screenshot, 2) How It Works (AI Explainer) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/check')}
            leftIcon={<SearchCheck className="w-5 h-5" />}
          >
            Analyze a Screenshot
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenHowItWorks ? onOpenHowItWorks('user') : onNavigate('/check')}
            leftIcon={<Sparkles className="w-4 h-4 text-orange-600" />}
          >
            How It Works (AI Explainer)
          </Button>
        </div>

        {/* Trust disclaimer */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500 max-w-md mx-auto text-center">
          <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            Screenshot analysis and duplicate detection. Independent payment confirmation is not included.
          </span>
        </div>

        {/* Live Report Preview */}
        <div className="pt-4 flex justify-center">
          <div className="w-full max-w-md relative">
            <div className="absolute -inset-1.5 rounded-3xl bg-orange-100/60 blur-xs -z-10"></div>
            <ReportPreviewCard />
          </div>
        </div>
      </section>

      {/* 2. Compact 3-Step Working Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-center">
              How CleanCheck Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              Simple 3-step evidence verification before you dispatch goods or mark orders paid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-orange-200 transition-colors">
              <span className="text-xl font-mono font-bold text-orange-600 block mb-2">01</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Upload Receipt</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop any Google Pay, PhonePe, or Paytm receipt. Processed client-side via HTML5 Canvas for speed and privacy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-orange-200 transition-colors">
              <span className="text-xl font-mono font-bold text-orange-600 block mb-2">02</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Dual-Hash & Field Check</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes SHA-256 and 64-bit DCT perceptual hash to catch recycled receipts, then extracts amount and 12-digit UTR.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-orange-200 transition-colors">
              <span className="text-xl font-mono font-bold text-orange-600 block mb-2">03</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Instant Verdict</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive clear findings: Clean, Warning, or Critical mismatch, with actionable next steps before finalizing.
              </p>
            </div>
          </div>

          {/* Quick AI Explainer Toggle Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Want to understand the interior architecture or user workflow in Hinglish?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenHowItWorks && onOpenHowItWorks('user')}
                className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 font-semibold hover:bg-orange-100 transition-colors cursor-pointer"
              >
                Aam Zindagi Mode
              </button>
              <button
                onClick={() => onOpenHowItWorks && onOpenHowItWorks('dev')}
                className="px-3 py-1.5 rounded-lg bg-black text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Dev Architecture</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Capabilities (Compact 4-Badge Grid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-black text-orange-500 flex items-center justify-center mb-3">
              <Copy className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Duplicate Receipt Detection</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Catches screenshots previously submitted across different orders using DCT perceptual image hashing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-black text-orange-500 flex items-center justify-center mb-3">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Expected Order Matching</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Cross-references receipt details against your expected order value, catching altered digits or missing zeros.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-black text-orange-500 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">12-Digit UTR Extraction</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Extracts and formats UPI transaction reference numbers for quick verification against your bank statement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-black text-orange-500 flex items-center justify-center mb-3">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Private Scan History</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Stores verified scans locally in browser storage so you can easily review previous disputes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Streamlined Merchant Banner (Compact, No Duplicate Buttons) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-900 text-orange-400 text-xs font-semibold border border-zinc-700">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span>For Instagram & WhatsApp Sellers</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Need to match receipts directly with open customer orders?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Track pending orders, run cross-matched scans, and streamline your dispatch queue in the Merchant Workspace.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/merchant')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Merchant Workspace
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Golden Rule & Trust Reminder */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-xs text-orange-950 flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
          <p className="text-left sm:text-center">
            <strong>Golden Rule</strong>: A payment screenshot is not proof of bank credit. Always verify settlement in your banking app before dispatching goods.
          </p>
        </div>
      </section>
    </div>
  );
};

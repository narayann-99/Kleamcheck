import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'CleanCheck Privacy Principles',
      content:
        'CleanCheck processes payment screenshots strictly for visual, OCR, and duplicate evidence analysis. In this frontend MVP phase, images are held only temporarily in memory via browser object URLs and are not stored in permanent remote storage or tracking databases. No bank login credentials, UPI PINs, or sensitive consumer passwords are ever requested or stored.',
    });
  };

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Terms of Evidence Analysis',
      content:
        'CleanCheck provides risk heuristics and screenshot consistency analysis. It does NOT independently verify or guarantee that fiat funds have settled into any banking or UPI settlement account. Merchants and individuals must always verify real credits directly within their authorized banking application or payment aggregator dashboard before fulfilling high-value goods or digital assets.',
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer inline-flex"
            >
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-orange-500 shadow-xs border border-black/80">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Clean<span className="text-orange-600">Check</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Verify the payment. Not just the screenshot. Payment-evidence intelligence helping individuals and merchants detect altered receipts and recycled proof before fulfilling orders.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg max-w-md">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>
                MVP Notice: Independent bank credit confirmation requires an authorized payment-provider integration.
              </span>
            </div>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/check')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Screenshot Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/merchant')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Merchant Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/merchant/orders')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Order Matching Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/merchant/scans')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Scan History & Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#privacy"
                  onClick={openPrivacy}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Privacy Principles
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={openTerms}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Terms of Analysis
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/merchant/settings')}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Merchant Security Settings
                </button>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                Contact: CleanCheck Developer Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CleanCheck. Payment Evidence Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Demo Environment Active
            </span>
          </div>
        </div>
      </div>

      {/* Info Dialog for Privacy / Terms */}
      {modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{modalContent.content}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

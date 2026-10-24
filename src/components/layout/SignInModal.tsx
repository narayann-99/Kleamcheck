import React from 'react';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'individual' | 'merchant') => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="signin-modal-title" className="text-lg font-semibold text-slate-900">
                Access CleanCheck
              </h3>
              <p className="text-xs text-slate-500">Sign in to your demo workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <span>Demo Authentication Sandbox</span>
            </div>
            <p>
              Full authentication will connect to Supabase Auth in the backend phase. For this MVP, you can choose a test role instantly:
            </p>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => {
                onSelectRole('individual');
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600">
                    Individual User
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Check a payment screenshot you received before delivering an item or service.
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-orange-600 group-hover:bg-orange-600 flex items-center justify-center text-white transition-colors">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                onSelectRole('merchant');
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600">
                    Merchant / Store Owner
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Match orders to receipts, scan duplicate files, and manage your review queue.
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-orange-600 group-hover:bg-orange-600 flex items-center justify-center text-white transition-colors">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

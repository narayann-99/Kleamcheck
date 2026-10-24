import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  History,
  Settings,
  ShieldCheck,
  SearchCheck,
  ExternalLink,
} from 'lucide-react';

interface MerchantSidebarProps {
  currentTab: 'overview' | 'orders' | 'scans' | 'settings';
  onSelectTab: (tab: 'overview' | 'orders' | 'scans' | 'settings') => void;
  onGoToChecker: () => void;
}

export const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  currentTab,
  onSelectTab,
  onGoToChecker,
}) => {
  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Orders & Matching', icon: ShoppingCart },
    { id: 'scans' as const, label: 'Scan History', icon: History },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="p-4 sm:p-5">
        {/* Merchant indicator & Demo mode tag */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900 truncate">
              CleanStore Merchant
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              cleanstore@icici
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 uppercase">
            Demo Mode
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Merchant Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher to Screenshot Checker */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <button
          onClick={onGoToChecker}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-200 transition-colors text-xs font-medium text-slate-700 hover:text-orange-600 cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <SearchCheck className="w-4 h-4 text-orange-600" />
            <span>Screenshot Checker</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600" />
        </button>

        <div className="px-2 text-[10px] text-slate-400 leading-tight">
          CleanCheck Evidence Platform • v0.1.0 MVP
        </div>
      </div>
    </aside>
  );
};

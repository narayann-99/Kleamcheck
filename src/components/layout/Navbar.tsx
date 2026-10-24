import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowRight, LayoutDashboard, SearchCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSignIn: () => void;
  onOpenHowItWorks?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSignIn,
  onOpenHowItWorks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleHowItWorksClick = () => {
    setMobileMenuOpen(false);
    if (onOpenHowItWorks) {
      onOpenHowItWorks();
    } else {
      onNavigate('/');
    }
  };

  const isMerchantRoute = currentPath.startsWith('/merchant');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-orange-500 shadow-xs group-hover:bg-slate-900 transition-colors border border-black/80">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Clean<span className="text-orange-600">Check</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold bg-orange-50 text-orange-800 border border-orange-200 px-1.5 py-0.5 rounded tracking-wide">
                MVP
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            <button
              onClick={handleHowItWorksClick}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-700 hover:text-orange-600 hover:bg-orange-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>How It Works (AI)</span>
            </button>
            <button
              onClick={() => handleNav('/check')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath === '/check'
                  ? 'text-orange-600 bg-orange-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => handleNav('/merchant')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isMerchantRoute
                  ? 'text-orange-600 bg-orange-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              For Merchants
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSignIn}
              aria-label="Sign in to demo account"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNav('/check')}
              leftIcon={<SearchCheck className="w-4 h-4" />}
            >
              Analyze a Screenshot
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-2.5 py-1.5"
              onClick={() => handleNav('/check')}
            >
              Check
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={handleHowItWorksClick}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-orange-50 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>How It Works (AI Explainer)</span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleNav('/check')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Screenshot Checker</span>
            <SearchCheck className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleNav('/merchant')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Merchant Dashboard</span>
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
            >
              Sign In (Demo Account)
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => handleNav('/check')}
              leftIcon={<SearchCheck className="w-4 h-4" />}
            >
              Analyze a Screenshot
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

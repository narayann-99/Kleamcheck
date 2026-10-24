import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SignInModal } from './components/layout/SignInModal';
import { HowItWorksAiModal } from './components/ai/HowItWorksAiModal';
import { LandingPage } from './pages/LandingPage';
import { CheckerPage } from './pages/CheckerPage';
import { MerchantPage } from './pages/MerchantPage';
import { OrderContext } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [howItWorksInitialMode, setHowItWorksInitialMode] = useState<'user' | 'dev'>('user');
  const [checkerContext, setCheckerContext] = useState<OrderContext | undefined>(undefined);

  // Initialize and handle browser back/forward navigation
  useEffect(() => {
    const normalizePath = (path: string) => {
      if (!path || path === '') return '/';
      return path;
    };

    setCurrentPath(normalizePath(window.location.pathname));

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCheckerWithOrder = (context: OrderContext) => {
    setCheckerContext(context);
    navigate('/check');
  };

  const handleSelectRole = (role: 'individual' | 'merchant') => {
    if (role === 'individual') {
      navigate('/check');
    } else {
      navigate('/merchant');
    }
  };

  // Derive initial merchant subtab from path
  const getMerchantTab = (): 'overview' | 'orders' | 'scans' | 'settings' => {
    if (currentPath === '/merchant/orders') return 'orders';
    if (currentPath === '/merchant/scans') return 'scans';
    if (currentPath === '/merchant/settings') return 'settings';
    return 'overview';
  };

  const handleOpenHowItWorks = (mode: 'user' | 'dev' = 'user') => {
    setHowItWorksInitialMode(mode);
    setIsHowItWorksOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-950">
      {/* Reusable Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenHowItWorks={() => handleOpenHowItWorks('user')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col">
        {currentPath === '/' && (
          <LandingPage
            onNavigate={navigate}
            onOpenHowItWorks={handleOpenHowItWorks}
          />
        )}

        {currentPath === '/check' && (
          <CheckerPage
            initialContext={checkerContext}
            onGoToMerchant={() => navigate('/merchant/scans')}
          />
        )}

        {currentPath.startsWith('/merchant') && (
          <MerchantPage
            initialTab={getMerchantTab()}
            onNavigateToCheckerWithOrder={handleNavigateToCheckerWithOrder}
            onGoToChecker={() => navigate('/check')}
            onTabChange={(tab) => {
              const newPath = tab === 'overview' ? '/merchant' : `/merchant/${tab}`;
              window.history.pushState(null, '', newPath);
              setCurrentPath(newPath);
            }}
          />
        )}
      </main>

      {/* Reusable Footer (only show on public pages to preserve dashboard layout) */}
      {!currentPath.startsWith('/merchant') && <Footer onNavigate={navigate} />}

      {/* Demo Sign In Dialog */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSelectRole={handleSelectRole}
      />

      {/* AI Explainer Dialog in Hinglish */}
      <HowItWorksAiModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        initialMode={howItWorksInitialMode}
        onGoToChecker={() => navigate('/check')}
      />
    </div>
  );
}

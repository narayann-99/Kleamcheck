import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Code2,
  Users,
  Send,
  Loader2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Cpu,
  RefreshCw,
} from 'lucide-react';

interface HowItWorksAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToChecker?: () => void;
  initialMode?: 'user' | 'dev';
}

export const HowItWorksAiModal: React.FC<HowItWorksAiModalProps> = ({
  isOpen,
  onClose,
  onGoToChecker,
  initialMode = 'user',
}) => {
  const [mode, setMode] = useState<'user' | 'dev'>(initialMode);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync mode if initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      fetchExplanation(initialMode);
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchExplanation = async (targetMode: 'user' | 'dev', query?: string) => {
    setLoading(true);
    if (query) {
      setActiveQuestion(query);
    } else {
      setActiveQuestion(null);
    }

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode, question: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      setContent(data.reply || '');
      setIsAiGenerated(Boolean(data.isAiGenerated));
    } catch (err) {
      console.warn('Fallback explanation used:', err);
      // Hardcoded high-fidelity fallback in Hinglish if fetch fails
      if (targetMode === 'user') {
        setContent(
          `👋 **CleanCheck Kya Hai & Ye Kaise Kaam Karta Hai? (Aam Zindagi Mode)**\n\nBhai, CleanCheck ek smart payment evidence verification platform hai jo shopkeepers, online sellers, aur freelancers ko fake payment screenshot scams se bachata hai.\n\n### 🔍 4 Steps Me Basic Working:\n\n1. **Screenshot Upload**: Aap customer ka bheja hua payment receipt (Google Pay, PhonePe, Paytm) upload karte ho.\n2. **Duplicate Check (Recycled Receipt)**: System check karta hai ki kya yehi screenshot pehle kisi aur order pe ya kisi aur seller ko toh nahi bheja gaya tha (Image Fingerprinting se).\n3. **Details Extraction**: Screenshot me se visible amount, 12-digit UTR (reference number), date, aur payee UPI ID ko automatically extract karta hai.\n4. **Order Match & Warnings**: Agar aapka order Rs. 1,500 ka tha aur receipt me Rs. 150 likha hai ya font me tampering hai, toh CleanCheck turant Laal (Critical Alert) de deta hai!\n\n⚠️ **Sabse Zaroori Baat (Golden Rule)**:\nScreenshot sirf ek photo hoti hai, bank settlement ka pakka proof nahi! Jab tak bank account ya official soundbox me credit na dikhe, tab tak dispatch mat karo.`
        );
      } else {
        setContent(
          `🛠️ **CleanCheck Interior Architecture & Working (Dev Info Mode)**\n\nCleanCheck ka architecture client-side privacy, double-hashing algorithms, aur rule-based heuristics par designed hai.\n\n### 🏗️ Interior Architecture & Flow:\n\n1. **Privacy-First Client-Side Canvas Decoding**:\nImage browser memory me HTMLCanvasElement ke through render hoti hai. Raw unencrypted receipts bina user action ke server par upload nahi hoti.\n\n2. **Dual-Layer Duplicate Fingerprint Detection**:\nSHA-256 exact cryptographic hash identical files ko 100% catch karta hai. Aur 64-bit Perceptual Hash (DCT / pHash) image ko 32x32 grayscale me convert karke visual fingerprint banata hai. Iska Hamming distance <= 10 hone par cropped ya compressed duplicate bhi pakad leta hai.\n\n3. **Heuristic Parsing & Pattern Matching**:\nIndian UPI receipt patterns ko parse karta hai: 12-digit UPI UTR regex (\\b[0-9]{12}\\b), currency amounts, aur Payee VPA handles (@okaxis, @okhdfcbank, @ybl, @paytm).\n\n4. **Risk Scoring Matrix**:\nClean (Green): Exact amount match, unique hash, valid 12-digit UTR.\nWarning (Amber): Low confidence OCR, slight time discrepancy, or repeat submission.\nCritical (Red): Amount mismatch with expected order, duplicate recycled hash across orders, or invalid UTR structure.\n\n5. **AI Explainer Proxy**:\nExpress server endpoint (/api/explain) server-side Gemini 3.8 Flash model se communicate karta hai, ensuring zero API key exposure on the client-side.`
        );
      }
      setIsAiGenerated(false);
    } finally {
      setLoading(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handleModeChange = (newMode: 'user' | 'dev') => {
    setMode(newMode);
    setCustomQuestion('');
    fetchExplanation(newMode);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || loading) return;
    fetchExplanation(mode, customQuestion.trim());
  };

  const handlePromptClick = (promptText: string) => {
    setCustomQuestion(promptText);
    fetchExplanation(mode, promptText);
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const quickPrompts =
    mode === 'user'
      ? [
          'Fake screenshot kaise pakadte hain?',
          'Duplicate receipt se kaise scam hota hai?',
          'Kya mera receipt data safe hai?',
          'Bank SMS check karna kyu zaroori hai?',
        ]
      : [
          'Perceptual DCT hash kaise calculate hota hai?',
          'Client-side Canvas pixel decoding flow kya hai?',
          'Hamming Distance threshold 10 kyu rakha gaya?',
          'Gemini AI server-side proxy kaise secure hai?',
        ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-explainer-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-black text-white px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-explainer-title" className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  CleanCheck AI Explainer
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Hinglish Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Understand how CleanCheck works in natural, friendly Hinglish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Selector: User-Friendly vs Dev Info */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('user')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'user'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span>User-Friendly Way (Aam Zindagi)</span>
            </button>
            <button
              onClick={() => handleModeChange('dev')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'dev'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-orange-500" />
              <span>Dev Info (Interior Architecture)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fetchExplanation(mode, activeQuestion || undefined)}
              disabled={loading}
              className="text-xs font-medium text-slate-500 hover:text-orange-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Regenerate explanation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !content}
              className="text-xs font-medium text-slate-600 hover:text-orange-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-orange-400 bg-white shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-6 py-2.5 bg-orange-50/40 border-b border-orange-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-orange-900 font-bold flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-orange-600" />
            Poocho:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-orange-950 hover:bg-orange-100/70 border border-orange-200/80 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                AI is generating your explanation in Hinglish...
              </p>
              <p className="text-xs text-slate-400">
                Analyzing {mode === 'user' ? 'user workflow' : 'under-the-hood architecture'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeQuestion && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>
                      Topic: <strong>"{activeQuestion}"</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => handleModeChange(mode)}
                    className="text-[11px] font-bold text-orange-700 hover:underline cursor-pointer"
                  >
                    Reset View
                  </button>
                </div>
              )}

              {/* Render Formatted Markdown-like Hinglish Output */}
              <div className="prose prose-slate max-w-none space-y-3">
                {content
                  .replace(/(###[^\n]+)/g, '\n\n$1\n\n')
                  .replace(/(⚠️[^\n]+)/g, '\n\n$1\n\n')
                  .split(/\n\s*\n/)
                  .map((block) => block.trim())
                  .filter(Boolean)
                  .map((block, bIdx) => {
                    // Headings
                    if (block.startsWith('### ')) {
                      return (
                        <h3
                          key={bIdx}
                          className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1.5 pt-2 flex items-center gap-2"
                        >
                          <span className="text-orange-600">▪</span>
                          <span>{block.replace('### ', '')}</span>
                        </h3>
                      );
                    }
                    if (block.startsWith('## ')) {
                      return (
                        <h2
                          key={bIdx}
                          className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 pt-2"
                        >
                          {block.replace('## ', '')}
                        </h2>
                      );
                    }

                    // Golden Rule or Warning Callout Box
                    if (block.includes('Golden Rule') || block.includes('⚠️')) {
                      return (
                        <div
                          key={bIdx}
                          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 shadow-2xs my-2"
                        >
                          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                            <span>Golden Rule (Yaad Rakhne Wali Baat)</span>
                          </div>
                          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed pl-7">
                            {block.replace(/^⚠️\s*/, '').replace(/.*Golden Rule.*?:/i, '').trim()}
                          </p>
                        </div>
                      );
                    }

                    // Numbered or Bulleted list
                    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
                    const isList = lines.length > 1 && lines.every((l) => /^\d+\./.test(l) || /^[-*]/.test(l));
                    if (isList) {
                      return (
                        <div key={bIdx} className="grid grid-cols-1 gap-2.5 my-2">
                          {lines.map((line, lIdx) => {
                            const cleanLine = line.replace(/^\d+\.\s*|^[-*]\s*/, '').trim();
                            return (
                              <div
                                key={lIdx}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-orange-200 transition-colors"
                              >
                                <span className="w-6 h-6 rounded-lg bg-black text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">
                                  {lIdx + 1}
                                </span>
                                <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                                  {formatBoldText(cleanLine)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // Standard Paragraph
                    return (
                      <p key={bIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {formatBoldText(block)}
                      </p>
                    );
                  })}
              </div>

              {/* Architecture Architecture Badge for Dev mode */}
              {mode === 'dev' && (
                <div className="mt-6 p-4 rounded-2xl bg-black text-white border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                    <Cpu className="w-4 h-4 text-orange-500" />
                    <span>Developer Architecture Note</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Stack: <strong>React 19 + TypeScript + Express + Vite + Tailwind CSS v4</strong>. Client-side perceptual DCT 64-bit hashing minimizes server load, while <strong>Gemini 3.8 Flash</strong> on Express proxy handles intelligent context parsing securely.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Hinglish Query Box */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleCustomQuestionSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={
                  mode === 'user'
                    ? 'Apna sawal Hinglish me poocho (e.g. "Kya ye Photoshop pakadta hai?")...'
                    : 'Tech sawal poocho (e.g. "DCT frequency matrix kaise banate hain?")...'
                }
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-2xs"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={!customQuestion.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Poocho</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Action Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {isAiGenerated ? 'Gemini 3.8 Flash Powered' : 'Smart Heuristic Knowledge Base'}
            </span>
            {onGoToChecker && (
              <button
                onClick={() => {
                  onClose();
                  onGoToChecker();
                }}
                className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Live Screenshot Check Karo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to format **bold** and `code` strings in paragraphs
function formatBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-orange-700 font-mono text-[11px] border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

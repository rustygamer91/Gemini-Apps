import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AnalysisResult } from './components/AnalysisResult';
import { factCheckContent } from './services/gemini';
import { FactCheckResult, LoadingState } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFactCheck = useCallback(async () => {
    if (!inputText.trim()) return;

    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await factCheckContent(inputText);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("Failed to verify content. Please try again later or check your API key.");
      setLoadingState(LoadingState.ERROR);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Verify information with confidence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Paste any text, claim, or article snippet below. Veritas uses Google Search and Gemini AI to cross-reference sources and analyze credibility instantly.
            </p>
          </div>

          {/* Input Section */}
          <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-500 ${result ? 'mb-12' : 'mb-0'}`}>
            <div className="p-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste text to verify here (e.g., 'Scientists discovered a new planet made entirely of diamond...')"
                className="w-full h-48 p-6 text-lg text-slate-800 placeholder-slate-400 bg-transparent border-none resize-none focus:ring-0 focus:outline-none"
                disabled={loadingState === LoadingState.ANALYZING}
              />
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span>Your text is processed privately and not stored.</span>
              </div>
              <button
                onClick={handleFactCheck}
                disabled={!inputText.trim() || loadingState === LoadingState.ANALYZING}
                className={`
                  px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200
                  flex items-center gap-2
                  ${!inputText.trim() || loadingState === LoadingState.ANALYZING 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                {loadingState === LoadingState.ANALYZING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Analyze & Verify
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error State */}
          {loadingState === LoadingState.ERROR && error && (
             <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-start gap-3 animate-fade-in">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
             </div>
          )}

          {/* Results Section */}
          {loadingState === LoadingState.SUCCESS && result && (
            <AnalysisResult result={result} />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;

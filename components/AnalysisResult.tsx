import React from 'react';
import { FactCheckResult, GroundingSource } from '../types';

interface AnalysisResultProps {
  result: FactCheckResult;
}

// Helper to color code verdicts
const getVerdictStyles = (verdict?: string) => {
  switch (verdict) {
    case 'Verified':
      return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✓', ring: 'ring-green-500/20' };
    case 'False':
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '✕', ring: 'ring-red-500/20' };
    case 'Misleading':
      return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: '!', ring: 'ring-orange-500/20' };
    case 'Mixed':
      return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚖', ring: 'ring-yellow-500/20' };
    default:
      return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', icon: '?', ring: 'ring-slate-500/20' };
  }
};

// Simple formatted text renderer (replaces newlines with <br> and **bold** with <strong>)
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split by newlines first
  const paragraphs = text.split('\n');
  
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed">
      {paragraphs.map((para, idx) => {
        if (!para.trim()) return null;
        
        // Simple bold parser
        const parts = para.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx}>
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="w-full animate-fade-in">
      {/* Verdict Card */}
      <div className={`rounded-xl border ${styles.border} ${styles.bg} p-6 mb-8 shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-8xl font-serif leading-none select-none">{styles.icon}</span>
        </div>
        
        <div className="relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1 text-slate-600">Verdict</h2>
            <div className={`text-3xl font-bold ${styles.text} flex items-center gap-3`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border ${styles.border}`}>
                {styles.icon}
              </span>
              {result.verdict || 'Analysis Complete'}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Detailed Analysis
                </h3>
                <FormattedText text={result.markdownText} />
            </div>
        </div>

        {/* Sources Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Verified Sources
                </h3>
                
                {result.sources.length > 0 ? (
                    <ul className="space-y-3">
                        {result.sources.map((source, idx) => (
                            <li key={idx} className="group">
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="text-xs text-slate-400 mb-1 truncate">{new URL(source.uri).hostname}</div>
                                    <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 line-clamp-2">
                                        {source.title}
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-slate-500 text-sm italic text-center py-4">
                        No direct web sources were linked by the grounding engine.
                    </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-400">
                    <p>Disclaimer: AI can make mistakes. Please verify independently.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

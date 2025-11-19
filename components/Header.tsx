import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            V
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Veritas <span className="text-indigo-600 font-medium">FactCheck</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100">
            Powered by Gemini 2.5
          </span>
        </div>
      </div>
    </header>
  );
};

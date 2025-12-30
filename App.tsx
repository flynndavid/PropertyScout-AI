import React, { useState } from 'react';
import { LeadForm } from './components/LeadForm';
import { AnalysisView } from './components/AnalysisView';
import { analyzeProperty } from './services/geminiService';
import { LeadInfo, AnalysisResult, AppState } from './types';
import { LoaderIcon, HouseIcon, GithubIcon, CheckCircleIcon } from './components/Icons';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [leadData, setLeadData] = useState<LeadInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLeadSubmit = async (data: LeadInfo) => {
    setLeadData(data);
    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeProperty(data.address);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("We encountered an issue analyzing this property. Please try checking the address or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setLeadData(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm flex-shrink-0">
                <HouseIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight whitespace-nowrap">PropertyScout AI</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200 whitespace-nowrap">
                Open Source
              </span>
            </div>
            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                 <a href="https://homeopshq.com" className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                    Hire HomeOpsHQ
                 </a>
                 <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                    <GithubIcon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Star on GitHub</span>
                </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          
          {appState === AppState.IDLE && (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] lg:min-h-[600px]">
               {/* Hero Content */}
               <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3 sm:mb-4">
                      Pre-Bid Property <br/>
                      <span className="text-indigo-600">Intelligence for Pros</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg">
                      Instantly retrieve foundation type, year built, and structural risks for any US residential address. The open-source standard for contractor lead intake.
                    </p>
                  </div>

                  <ul className="space-y-3 sm:space-y-4">
                     {[
                        "Instant Foundation Verification (Slab vs Basement)",
                        "Public Tax & Assessment History",
                        "Flood Zone & Environmental Risk",
                        "Automated Layout & Listing Analysis"
                     ].map((item, i) => (
                        <li key={i} className="flex items-start sm:items-center gap-3 text-slate-700 font-medium text-sm sm:text-base">
                           <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  
                  <div className="pt-4">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Powered By</p>
                     <div className="flex flex-wrap items-center gap-4 sm:gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake logos for demo effect */}
                        <div className="font-bold text-slate-600 text-sm sm:text-base">Google Gemini</div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="font-bold text-slate-600 text-sm sm:text-base">Firecrawl</div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="font-bold text-slate-600 text-sm sm:text-base">HomeOpsHQ</div>
                     </div>
                  </div>
               </div>

               {/* Form Container */}
               <div className="order-1 lg:order-2 w-full max-w-lg mx-auto lg:max-w-none">
                  <LeadForm onSubmit={handleLeadSubmit} isLoading={false} />
                  <p className="text-center mt-6 text-sm text-slate-400">
                    Want this on your website? <a href="#" className="text-indigo-600 hover:underline">Get the code</a>
                  </p>
               </div>
            </div>
          )}

          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 max-w-2xl mx-auto text-center">
              <div className="relative mb-8">
                 <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                 <div className="bg-white p-6 rounded-full shadow-xl border border-indigo-50 relative z-10">
                    <LoaderIcon className="w-10 h-10 text-indigo-600 animate-spin" />
                 </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Analyzing Property Assets</h2>
              <div className="w-full max-w-md bg-slate-200 rounded-full h-2 mb-6 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full animate-[loading_2s_ease-in-out_infinite] w-1/2"></div>
              </div>
              <div className="space-y-2 text-slate-500 text-sm sm:text-base">
                 <p className="animate-pulse">Retrieving public tax records...</p>
                 <p className="animate-pulse delay-75">Identifying structural composition...</p>
                 <p className="animate-pulse delay-150">Synthesizing contractor brief...</p>
              </div>
            </div>
          )}

          {appState === AppState.ERROR && (
             <div className="max-w-md mx-auto text-center py-12 sm:py-24">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-red-100 shadow-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2">Analysis Interrupted</h3>
                    <p className="text-slate-500 mb-6 text-sm sm:text-base">{error}</p>
                    <button 
                        onClick={() => setAppState(AppState.IDLE)}
                        className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        Try Again
                    </button>
                </div>
             </div>
          )}

          {appState === AppState.SUCCESS && leadData && analysisResult && (
            <AnalysisView 
                result={analysisResult} 
                lead={leadData} 
                onReset={handleReset}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                 <div className="bg-slate-900 p-1 rounded">
                    <HouseIcon className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold text-slate-900">PropertyScout AI</span>
            </div>
            
            <div className="text-slate-500 text-sm flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                <a href="#" className="hover:text-slate-900">Documentation</a>
                <a href="https://homeopshq.com" className="hover:text-slate-900">Hire HomeOpsHQ</a>
                <a href="https://github.com" className="hover:text-slate-900">GitHub</a>
            </div>

            <p className="text-slate-400 text-sm text-center md:text-right">
                Open Source License. Built for Pros.
            </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default App;
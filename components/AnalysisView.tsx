import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult, LeadInfo } from '../types';
import { CheckCircleIcon, HouseIcon, LayoutIcon, MapPinIcon, ClipboardIcon, ExternalLinkIcon } from './Icons';

interface AnalysisViewProps {
  result: AnalysisResult;
  lead: LeadInfo;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, lead, onReset }) => {
  const [activeTab, setActiveTab] = useState<'reasoning' | 'sources'>('reasoning');

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Header Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Site Assessment Report</h2>
            <div className="text-slate-500 text-sm mt-1 flex flex-wrap gap-2 items-center">
                <span>Prepared for {lead.name}</span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span className="flex items-center gap-1 w-full sm:w-auto">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{lead.address}</span>
                </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              Verified Public Data
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Key Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
              <HouseIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Structural Specs</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <span className="text-sm text-slate-400 block mb-1">Foundation Type</span>
                <span className={`text-lg sm:text-xl font-bold px-3 py-1 rounded-md inline-block ${
                  result.foundationType === 'Basement' ? 'bg-orange-100 text-orange-700' :
                  result.foundationType === 'Crawl Space' ? 'bg-yellow-100 text-yellow-700' :
                  result.foundationType === 'Slab' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {result.foundationType}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-slate-400 block mb-1">Year Built</span>
                  <span className="font-semibold text-slate-800">{result.yearBuilt}</span>
                </div>
                <div>
                  <span className="text-sm text-slate-400 block mb-1">Size</span>
                  <span className="font-semibold text-slate-800">{result.sqFt} sqft</span>
                </div>
                <div>
                  <span className="text-sm text-slate-400 block mb-1">Config</span>
                  <span className="font-semibold text-slate-800">{result.beds}bd / {result.baths}ba</span>
                </div>
                <div>
                  <span className="text-sm text-slate-400 block mb-1">Est. Value</span>
                  <span className="font-semibold text-slate-800">{result.estimatedValue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
               <h3 className="font-semibold text-slate-800">Financial Context</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <div>
                    <span className="text-sm text-slate-400 block mb-1">Market Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {result.listingStatus}
                    </span>
                </div>
                <div>
                    <span className="text-sm text-slate-400 block mb-1">Tax Assessment Note</span>
                    <p className="text-sm text-slate-700 line-clamp-3">{result.taxHistory}</p>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
              <ClipboardIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Site Logistics</h3>
            </div>
            <div className="p-4 sm:p-6">
                <div className="mb-4">
                   <span className="text-xs font-bold uppercase text-slate-400">Environmental</span>
                   <p className="text-sm text-slate-700 font-medium">Flood Zone: {result.floodZone}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Based on the {result.yearBuilt} construction and {result.foundationType} foundation, contractors should prepare for
                    {result.foundationType === 'Basement' ? ' sub-grade access requirements and potential moisture mitigation.' : 
                     result.foundationType === 'Crawl Space' ? ' confined space entry protocols and insulation checks.' : 
                     result.foundationType === 'Slab' ? ' rigid access for plumbing/mechanicals and simplified structural load bearing.' : 
                     ' a custom onsite inspection to determine access points.'}
                </p>
                
                <a 
                    href={result.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                    <ExternalLinkIcon className="w-4 h-4" />
                    View on Google Maps
                </a>
            </div>
          </div>
        </div>

        {/* Center/Right: Tabbed Analysis & Sources */}
        <div className="lg:col-span-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
             {/* Tabs Header */}
             <div className="bg-slate-50 border-b border-slate-200 flex">
                <button
                  onClick={() => setActiveTab('reasoning')}
                  className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-xs sm:text-sm font-bold text-center transition-colors focus:outline-none ${
                    activeTab === 'reasoning' 
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Contractor Intel
                </button>
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`flex-1 py-3 sm:py-4 px-2 sm:px-6 text-xs sm:text-sm font-bold text-center transition-colors focus:outline-none ${
                    activeTab === 'sources' 
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Source Data
                </button>
             </div>

             {/* Tab Content */}
             <div className="p-4 sm:p-6 flex-grow">
               {activeTab === 'reasoning' && (
                  <div className="prose prose-slate prose-sm max-w-none text-slate-700">
                    <ReactMarkdown>{result.reasoning}</ReactMarkdown>
                  </div>
               )}

               {activeTab === 'sources' && (
                  <div>
                    {result.groundingSources.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-4">
                          Verified property data from the following public sources:
                        </p>
                        <ul className="space-y-3">
                          {result.groundingSources.map((source, i) => (
                            <li key={i} className="text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 flex flex-col group">
                                  <span className="font-bold text-slate-900 group-hover:text-indigo-700 break-all">{source.title}</span>
                                  <span className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                                    <span className="truncate">{source.uri}</span>
                                  </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 text-yellow-800 text-sm">
                          <p className="font-semibold mb-2">No Direct Links Available</p>
                          <p>
                            No specific web links were returned by the agent for this query, but the data was synthesized from internal knowledge and aggregated records.
                          </p>
                      </div>
                    )}
                  </div>
               )}
             </div>
          </div>
          
           {/* Promo Card for SaaS Version */}
          <div className="mt-6 bg-indigo-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
             <div className="text-center md:text-left">
                <h4 className="font-bold text-lg mb-1">Build your own custom version</h4>
                <p className="text-indigo-200 text-sm">Clone this repo or hire HomeOpsHQ to integrate this into your CRM.</p>
             </div>
             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap bg-white text-indigo-900 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors w-full md:w-auto text-center">
                View Source Code
             </a>
          </div>

        </div>
      </div>
      
      <div className="text-center pt-8">
        <button onClick={onReset} className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
            Start New Search
        </button>
      </div>
    </div>
  );
};
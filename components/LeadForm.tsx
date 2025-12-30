import React, { useState, useEffect, useRef } from 'react';
import { LeadInfo } from '../types';
import { MapPinIcon, HouseIcon } from './Icons';
import { getAddressSuggestions, AddressSuggestion } from '../services/addressService';

interface LeadFormProps {
  onSubmit: (data: LeadInfo) => void;
  isLoading: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LeadInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Debounce address search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (showSuggestions && formData.address.length > 2) {
        const results = await getAddressSuggestions(formData.address);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.address, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, address: e.target.value }));
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({ ...prev, address: suggestion.display_name }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            alert("Location detected. Please refine the street address.");
            const addressInput = document.getElementById('address');
            if(addressInput) addressInput.focus();
        }, (error) => {
            console.error(error);
        });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="p-5 sm:p-6 md:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Create New Property Brief</h3>
        <p className="text-slate-500 text-sm mb-6">Enter details to generate an AI-powered site assessment.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div ref={wrapperRef}>
            <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">Target Property</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HouseIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="address"
                id="address"
                required
                autoComplete="off"
                className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder-slate-400 focus:bg-white text-sm sm:text-base"
                placeholder="123 Maple Ave, Springfield, IL"
                value={formData.address}
                onChange={handleAddressChange}
                onFocus={() => { if(formData.address.length > 2) setShowSuggestions(true); }}
              />
               <button 
                  type="button"
                  onClick={handleUseLocation}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-indigo-600"
                  title="Use my location"
              >
                  <MapPinIcon className="h-5 w-5" />
              </button>
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
                    <li 
                      key={suggestion.place_id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0 flex items-start gap-2"
                    >
                      <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{suggestion.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Contractor Name</label>
                  <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 focus:bg-white text-sm sm:text-base"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={handleChange}
                  />
              </div>
               <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      className="block w-full px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 focus:bg-white text-sm sm:text-base"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                  />
              </div>
          </div>

          <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email for Report</label>
              <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="block w-full px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 focus:bg-white text-sm sm:text-base"
                  placeholder="jane@construction-inc.com"
                  value={formData.email}
                  onChange={handleChange}
              />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isLoading ? 'Gathering Intelligence...' : 'Generate Property Brief'}
          </button>
        </form>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-slate-500 font-medium">Gemini AI Active</span>
         </div>
         <span className="text-xs text-slate-400">Powered by PropertyScout</span>
      </div>
    </div>
  );
};
export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AnalysisResult {
  foundationType: 'Slab' | 'Crawl Space' | 'Basement' | 'Unknown';
  yearBuilt: string;
  sqFt: string;
  beds: string;
  baths: string;
  estimatedValue: string;
  floodZone: string;
  taxHistory: string;
  listingStatus: string;
  layoutDescription: string;
  reasoning: string;
  mapLink?: string;
  groundingSources: Array<{
    uri: string;
    title: string;
  }>;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
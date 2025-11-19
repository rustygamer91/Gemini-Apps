// Define the structure for a source returned by Grounding
export interface GroundingSource {
  title: string;
  uri: string;
}

// Define the internal structure for our fact check result
export interface FactCheckResult {
  markdownText: string;
  sources: GroundingSource[];
  verdict?: 'Verified' | 'False' | 'Misleading' | 'Mixed' | 'Unverifiable';
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

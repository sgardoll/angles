export interface RedditPost {
  subreddit: string;
  title: string;
  body: string;
  flair?: string;
  angleExplanation: string; // The strategy/angle used
  selfPromotionRisk: 'Low' | 'Medium' | 'High';
}

export interface AngleResponse {
  angles: RedditPost[];
}

export interface AnalysisRequest {
  youtubeUrl?: string;
  transcript: string;
  mediaFile?: File | null;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
}

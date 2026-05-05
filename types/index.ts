export type MatchLevel = 'Perfect' | 'Strong' | 'Good' | 'Partial' | 'Weak';

export interface MatchResult {
  score: number;
  level: MatchLevel;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export interface NewsItem {
  title: string;
  source: string;
  pubDate: string;
  link: string;
}

export interface PrepResults {
  match: MatchResult;
  role: {
    title: string;
    company: string;
    website?: string;
  };
  companySnapshot: {
    overview: string;
    businessModel: string;
    culture: string;
  };
  whatTheyReallyWant: {
    summary: string;
    topPriorities: string[];
    cultureSignals: string[];
    redFlags: string[];
  };
  whyThisCompany: string[];
  whyYou: string[];
  talkingPoints: string[];
  questionsToAsk: string[];
  recentNews: NewsItem[];
  elevatorPitch: string;
}

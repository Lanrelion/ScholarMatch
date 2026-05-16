export type FilterKey = "all" | "fullFunding" | "europe" | "masters";

export type MatchSignal = {
  pass: boolean;
  partial?: boolean;
  label: string | null;
};

export type MatchBreakdown = {
  nationality: MatchSignal;
  degreeLevel: MatchSignal;
  field: MatchSignal;
  gpa: MatchSignal;
  financialNeed: MatchSignal;
  workExperience: MatchSignal;
};

export type ScholarshipWithMatch = {
  id: string;
  title: string;
  provider: string; // Called 'funder' in the prompt, but 'provider' in Prisma schema. 
  sourceUrl: string;
  sourceDomain: string | null;
  description: string | null;
  amount: number | null;
  currency: string | null;
  deadline: string | null; // ISO string from JSON response
  eligibleDegrees: string[];
  eligibleNationalities: string[];
  fieldsOfStudy: string[]; // Called 'fields' in prompt, but 'fieldsOfStudy' in schema
  eligibilityRaw: string | null;
  eligibilityParsed: Record<string, any> | null;
  verified: boolean;
  isActive: boolean;
  lastCrawledAt: string | null;
  lastChangedAt: string | null;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
};

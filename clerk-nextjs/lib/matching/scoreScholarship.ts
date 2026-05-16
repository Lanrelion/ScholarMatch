import { Scholarship, DegreeLevel } from "@prisma/client";
import { MatchBreakdown } from "@/types/scholarship";

export type ProfileForMatching = {
  nationality: string | null;
  currentDegree: DegreeLevel | null;
  fieldOfStudy: string | null;
  gpa: number | null;
  gpaScale: number | null;
  needsFinancialAid: boolean;
  workExperienceYears: number | null;
  countryOfStudy: string | null; // Added for destination matching
};

const WEIGHTS = {
  nationality:     0.25,
  degreeLevel:     0.20,
  field:           0.18,
  gpa:             0.12,
  financialNeed:   0.08,
  targetCountry:   0.10,
  programMatch:    0.07,
};

export function scoreScholarship(
  scholarship: Scholarship,
  profile: ProfileForMatching
): { matchScore: number; matchBreakdown: MatchBreakdown } {
  let score = 0;
  const breakdown: MatchBreakdown = {
    nationality: { pass: false, label: null },
    degreeLevel: { pass: false, label: null },
    field: { pass: false, label: null },
    gpa: { pass: false, label: null },
    financialNeed: { pass: false, label: null },
    workExperience: { pass: false, label: null },
  };

  // 1. Nationality (25%)
  const isNational = scholarship.eligibleNationalities.length === 0 || scholarship.eligibleNationalities.includes(profile.nationality || "");
  if (isNational) {
    score += WEIGHTS.nationality;
    breakdown.nationality = { pass: true, label: scholarship.eligibleNationalities.length === 0 ? "Open to all nationalities" : `Eligible for ${profile.nationality} citizens` };
  } else {
    breakdown.nationality = { pass: false, label: `Not eligible for ${profile.nationality} citizens` };
  }

  // 2. Degree Level (20%)
  const isDegreeMatch = scholarship.eligibleDegrees.length === 0 || scholarship.eligibleDegrees.includes(profile.currentDegree as any);
  if (isDegreeMatch) {
    score += WEIGHTS.degreeLevel;
    breakdown.degreeLevel = { pass: true, label: scholarship.eligibleDegrees.length === 0 ? "Open to all degree levels" : `Matches your ${profile.currentDegree} level` };
  } else {
    breakdown.degreeLevel = { pass: false, label: `Requires ${scholarship.eligibleDegrees.join(", ")}` };
  }

  // 3. Field of Study (18%)
  const scholarshipFields = scholarship.fieldsOfStudy || [];
  const isFieldMatch = scholarshipFields.length === 0 || 
    (profile.fieldOfStudy && scholarshipFields.some(f => f.toLowerCase() === profile.fieldOfStudy?.toLowerCase()));
  
  if (isFieldMatch) {
    score += WEIGHTS.field;
    breakdown.field = { 
      pass: true, 
      label: scholarshipFields.length === 0 ? "Open to all fields" : "Matches your field of study" 
    };
  } else {
    breakdown.field = { pass: false, label: `Requires ${scholarshipFields.join(", ")}` };
  }

  // 4. GPA (12%)
  const eligParsed = scholarship.eligibilityParsed as any;
  const minGpa = eligParsed?.gpaMinimum;
  const minGpaScale = eligParsed?.gpaScale || 4.0;

  if (!minGpa) {
    score += WEIGHTS.gpa;
    breakdown.gpa = { pass: true, label: "No GPA minimum specified" };
  } else if (profile.gpa) {
    const normalizedProfileGpa = (profile.gpa / (profile.gpaScale || 4.0)) * 4.0;
    const normalizedMinGpa = (minGpa / minGpaScale) * 4.0;

    if (normalizedProfileGpa >= normalizedMinGpa) {
      score += WEIGHTS.gpa;
      breakdown.gpa = { pass: true, label: `Meets minimum ${minGpa} / ${minGpaScale}` };
    } else {
      breakdown.gpa = { pass: false, label: `Requires ${minGpa} / ${minGpaScale} — yours is ${profile.gpa}` };
    }
  } else {
    breakdown.gpa = { pass: false, partial: true, label: "Add your GPA to verify eligibility" };
  }

  // 5. Financial Need (8%)
  const needsAidRequired = eligParsed?.financialNeedRequired;
  if (!needsAidRequired) {
    score += WEIGHTS.financialNeed;
    breakdown.financialNeed = { pass: true, label: "Not strictly need-based" };
  } else if (profile.needsFinancialAid) {
    score += WEIGHTS.financialNeed;
    breakdown.financialNeed = { pass: true, label: "Matches your financial need" };
  } else {
    breakdown.financialNeed = { pass: false, label: "This scholarship is reserved for students with financial need" };
  }

  // 6. Target country match (10%)
  if (!scholarship.universityCountry) {
    score += WEIGHTS.targetCountry;
    breakdown.targetCountry = { pass: true, label: "No destination restriction" };
  } else if (profile.countryOfStudy) {
    if (profile.countryOfStudy === scholarship.universityCountry) {
      score += WEIGHTS.targetCountry;
      breakdown.targetCountry = {
        pass: true,
        label: "Matches your preferred destination"
      };
    } else {
      score += WEIGHTS.targetCountry * 0.3;
      breakdown.targetCountry = {
        pass: false,
        partial: true,
        label: `This is in ${scholarship.universityCountry}, not your preferred destination`
      };
    }
  } else {
    score += WEIGHTS.targetCountry * 0.7;
    breakdown.targetCountry = {
      pass: true,
      label: "Set a destination to improve this match"
    };
  }

  // 7. Program match (7%)
  if (!scholarship.programName) {
    score += WEIGHTS.programMatch;
    breakdown.programMatch = {
      pass: true,
      label: "Open to all programs"
    };
  } else if (profile.fieldOfStudy) {
    const programLower = scholarship.programName.toLowerCase();
    const fieldLower = profile.fieldOfStudy.toLowerCase();
    
    if (programLower.includes(fieldLower) || fieldLower.includes(programLower)) {
      score += WEIGHTS.programMatch;
      breakdown.programMatch = {
        pass: true,
        label: "Program matches your field"
      };
    } else {
      breakdown.programMatch = {
        pass: false,
        partial: false,
        label: `Program: ${scholarship.programName}`
      };
    }
  }

  if (scholarship.applicationRoute === "ADMISSION_FIRST") {
    breakdown.applicationRoute = {
      label: "You must be admitted to this university first",
      type: "info"
    };
  }

  // Round score to avoid floating point weirdness
  score = Math.round(score * 100) / 100;

  return { matchScore: score, matchBreakdown: breakdown };
}


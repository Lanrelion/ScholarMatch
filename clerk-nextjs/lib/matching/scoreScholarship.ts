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
};

export function scoreScholarship(
  scholarship: {
    eligibleNationalities: string[];
    eligibleDegrees: DegreeLevel[];
    fieldsOfStudy: string[];
    eligibilityParsed: any;
  },
  profile: ProfileForMatching
): { matchScore: number; matchBreakdown: MatchBreakdown } {
  let score = 0;
  const breakdown: MatchBreakdown = {
    nationality: { pass: false, label: "" },
    degreeLevel: { pass: false, label: "" },
    field: { pass: false, label: "" },
    gpa: { pass: false, label: "" },
    financialNeed: { pass: false, label: "" },
    workExperience: { pass: false, label: "" },
  };

  // 1. Nationality (20%)
  const isNational = scholarship.eligibleNationalities.includes(profile.nationality || "");
  if (isNational) {
    score += 0.2;
    breakdown.nationality = { pass: true, label: `Eligible for ${profile.nationality} citizens` };
  } else {
    breakdown.nationality = { pass: false, label: `Not eligible for ${profile.nationality} citizens` };
  }

  // 2. Degree Level (20%)
  const isDegreeMatch = scholarship.eligibleDegrees.includes(profile.currentDegree as any);
  if (isDegreeMatch) {
    score += 0.2;
    breakdown.degreeLevel = { pass: true, label: `Matches your ${profile.currentDegree} level` };
  } else {
    breakdown.degreeLevel = { pass: false, label: `Requires ${scholarship.eligibleDegrees.join(", ")}` };
  }

  // 3. Field of Study (15%)
  const scholarshipFields = scholarship.fieldsOfStudy || [];
  const isFieldMatch = scholarshipFields.length === 0 || 
    (profile.fieldOfStudy && scholarshipFields.some(f => f.toLowerCase() === profile.fieldOfStudy?.toLowerCase()));
  
  if (isFieldMatch) {
    score += 0.15;
    breakdown.field = { 
      pass: true, 
      label: scholarshipFields.length === 0 ? "Open to all fields" : "Matches your field of study" 
    };
  } else {
    breakdown.field = { pass: false, label: `Requires ${scholarshipFields.join(", ")}` };
  }

  // 4. GPA (15%)
  const eligParsed = scholarship.eligibilityParsed as any;
  const minGpa = eligParsed?.gpaMinimum;
  const minGpaScale = eligParsed?.gpaScale || 4.0;

  if (!minGpa) {
    score += 0.15;
    breakdown.gpa = { pass: true, label: "No GPA minimum specified" };
  } else if (profile.gpa) {
    const normalizedProfileGpa = (profile.gpa / (profile.gpaScale || 4.0)) * 4.0;
    const normalizedMinGpa = (minGpa / minGpaScale) * 4.0;

    if (normalizedProfileGpa >= normalizedMinGpa) {
      score += 0.15;
      breakdown.gpa = { pass: true, label: `Meets minimum ${minGpa} / ${minGpaScale}` };
    } else {
      breakdown.gpa = { pass: false, label: `Requires ${minGpa} / ${minGpaScale} — yours is ${profile.gpa}` };
    }
  } else {
    breakdown.gpa = { pass: false, partial: true, label: "Add your GPA to verify eligibility" };
  }

  // 5. Work Experience (15%)
  const minWorkExp = eligParsed?.minWorkExperienceYears || 0;
  if (minWorkExp === 0) {
    score += 0.15;
    breakdown.workExperience = { pass: true, label: "No work experience required" };
  } else {
    const userExp = profile.workExperienceYears || 0;
    if (userExp >= minWorkExp) {
      score += 0.15;
      breakdown.workExperience = { pass: true, label: `Meets ${minWorkExp}+ years requirement` };
    } else {
      breakdown.workExperience = { pass: false, label: `Requires ${minWorkExp} years — you have ${userExp}` };
    }
  }

  // 6. Financial Need (15%)
  const needsAidRequired = eligParsed?.financialNeedRequired;
  if (!needsAidRequired) {
    score += 0.15;
    breakdown.financialNeed = { pass: true, label: "Not strictly need-based" };
  } else if (profile.needsFinancialAid) {
    score += 0.15;
    breakdown.financialNeed = { pass: true, label: "Matches your financial need" };
  } else {
    breakdown.financialNeed = { pass: false, label: "This scholarship is reserved for students with financial need" };
  }

  return { matchScore: score, matchBreakdown: breakdown };
}


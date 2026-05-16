import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function testFull() {
  const userId = 'test_ng_3';
  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Profile missing");

  const scholarships = await db.scholarship.findMany({
    where: {
      isActive: true,
      OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
      AND: [
        {
          OR: [
            { eligibleNationalities: { isEmpty: true } },
            { eligibleNationalities: { has: profile.nationality! } }
          ]
        },
        {
          OR: [
            { eligibleDegrees: { isEmpty: true } },
            { eligibleDegrees: { has: profile.currentDegree! } }
          ]
        }
      ]
    }
  });

  const results = scholarships.map((scholarship) => {
    let score = 0;
    const breakdown: any = {};

    // Nationality (0.30)
    if (scholarship.eligibleNationalities.length === 0) {
      score += 0.30;
      breakdown.nationality = { pass: true, label: "Open to all nationalities" };
    } else if (scholarship.eligibleNationalities.includes(profile.nationality!)) {
      score += 0.30;
      breakdown.nationality = { pass: true, label: `Eligible for ${profile.nationality} citizens` };
    }

    // Degree (0.25)
    if (scholarship.eligibleDegrees.length === 0) {
      score += 0.25;
      breakdown.degreeLevel = { pass: true, label: "Open to all degree levels" };
    } else if (scholarship.eligibleDegrees.includes(profile.currentDegree!)) {
      score += 0.25;
      breakdown.degreeLevel = { pass: true, label: `Matches your ${profile.currentDegree} level` };
    }

    // Field (0.20)
    if (scholarship.fieldsOfStudy.length === 0) {
      score += 0.20;
      breakdown.field = { pass: true, partial: false, label: "Open to all fields" };
    } else if (profile.fieldOfStudy && scholarship.fieldsOfStudy.some(f => 
      f.toLowerCase().includes(profile.fieldOfStudy!.toLowerCase()) ||
      profile.fieldOfStudy!.toLowerCase().includes(f.toLowerCase())
    )) {
      score += 0.20;
      breakdown.field = { pass: true, partial: false, label: "Matches your field of study" };
    } else {
      score += 0.05; 
      breakdown.field = { pass: false, partial: true, label: "May not match your field exactly" };
    }

    // GPA (0.15)
    const parsed = scholarship.eligibilityParsed as any;
    const gpaMin = parsed?.gpaMinimum;
    if (!gpaMin) {
      score += 0.15;
      breakdown.gpa = { pass: true, partial: false, label: "No GPA minimum specified" };
    } else if (profile.gpa) {
      const normalised = (profile.gpa / (profile.gpaScale ?? 4)) * 4;
      if (normalised >= gpaMin) {
        score += 0.15;
        breakdown.gpa = { pass: true, partial: false, label: `Meets minimum ${gpaMin} / 4.0` };
      } else if (normalised >= gpaMin - 0.3) {
        score += 0.07;
        breakdown.gpa = { pass: false, partial: true, label: `Requires ${gpaMin} — yours is ${normalised.toFixed(2)} (normalised)` };
      } else {
        breakdown.gpa = { pass: false, partial: false, label: `Requires ${gpaMin} — yours is ${normalised.toFixed(2)} (normalised)` };
      }
    }

    // Financial Need (0.10)
    const needsBased = parsed?.financialNeedRequired === true;
    if (!needsBased) {
      score += 0.10;
      breakdown.financialNeed = { pass: true, label: "Not strictly need-based" };
    } else if (profile.needsFinancialAid) {
      score += 0.10;
      breakdown.financialNeed = { pass: true, label: "Matches your financial need" };
    } else {
      breakdown.financialNeed = { pass: false, label: "Requires demonstrated financial need" };
    }

    return {
      title: scholarship.title,
      matchScore: Math.round(score * 100) / 100,
      matchBreakdown: breakdown
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);
  console.log(JSON.stringify(results, null, 2));
}

testFull().finally(() => db.$disconnect());

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';
import { DegreeLevel } from '@prisma/client';

async function seed() {
  const ALL_AFRICAN_ISO = ["NG", "KE", "GH", "ZA", "TZ", "UG", "ZM", "ZW", "RW", "ET", "CM", "BJ", "BF", "CI", "SN", "ML", "NE", "TD", "ST", "CV", "AO", "MZ", "BW", "LS", "SZ", "MW", "GM", "SL", "LR", "GN", "GW", "BI", "DJ", "ER", "SO", "SS", "SD", "MU", "SC", "KM", "GA", "CG", "CD", "GQ", "CF", "MA", "DZ", "TN", "LY", "EG"];

  // 1. Delete all existing mastercard-related scholarships by URL substrings
  await db.scholarship.deleteMany({
    where: { 
      OR: [
        { sourceUrl: { contains: "mastercardfdn.org" } },
        { title: { contains: "Mastercard" } }
      ]
    }
  });

  const mastercardPartners = [
    {
      title: "Mastercard Foundation Scholars at University of Toronto (Graduate)",
      hostInstitution: "University of Toronto",
      hostCountry: "CA",
      sourceUrl: "https://mastercardfdn.org/uoft-graduate-2026",
      deadline: new Date("2026-10-10T00:00:00Z"),
      eligibleDegrees: [DegreeLevel.MASTERS, DegreeLevel.PHD],
    },
    {
      title: "Mastercard Foundation Scholars at Makerere University",
      hostInstitution: "Makerere University",
      hostCountry: "UG",
      sourceUrl: "https://mastercardfdn.org/makerere-2026",
      deadline: new Date("2026-06-05T00:00:00Z"),
      eligibleDegrees: [DegreeLevel.UNDERGRADUATE, DegreeLevel.MASTERS],
    },
    {
      title: "Mastercard Foundation Scholars at University of Pretoria",
      hostInstitution: "University of Pretoria",
      hostCountry: "ZA",
      sourceUrl: "https://mastercardfdn.org/pretoria-2026",
      deadline: new Date("2026-08-31T00:00:00Z"),
      eligibleDegrees: [DegreeLevel.UNDERGRADUATE, DegreeLevel.MASTERS],
    }
  ];

  for (const p of mastercardPartners) {
    await db.scholarship.create({
      data: {
        ...p,
        provider: "Mastercard Foundation",
        parentProgramId: "mastercard-foundation",
        description: `Part of the Mastercard Foundation Scholars Program at ${p.hostInstitution}. This scholarship provides full support to academically talented young people from Africa.`,
        eligibleNationalities: ALL_AFRICAN_ISO,
        verified: true,
        isActive: true,
        eligibilityParsed: {
          fundingType: "full",
          financialNeedRequired: true,
          nationalityRule: "African citizen"
        }
      }
    });
  }
  console.log("Success: Mastercard umbrella seeded.");
}

seed().finally(() => db.$disconnect());

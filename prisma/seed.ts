// @ts-nocheck
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
console.log("DB URL IS:", process.env.DATABASE_URL ? "SET" : "UNDEFINED");

import { PrismaClient, DegreeLevel } from '@prisma/client';

const ALL_AFRICAN_ISO = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CF", "TD", "KM", "CG", "CD", 
  "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", 
  "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", 
  "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", 
  "TG", "TN", "UG", "ZM", "ZW"
];

const SUB_SAHARAN_ISO = ALL_AFRICAN_ISO.filter(code => !["DZ", "EG", "LY", "MA", "SD", "TN", "EH"].includes(code));

const COMMONWEALTH_AFRICA = [
  "NG", "KE", "GH", "ZA", "TZ", "UG", "ZM", "ZW", "RW", "CM", "MZ", "MW", 
  "NA", "BW", "LS", "SZ", "GM", "SL", "MU", "SC"
];

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();

  // SCHOLARSHIP 1
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.chevening.org/scholarships/" },
    update: { deadline: new Date("2026-11-05T00:00:00.000Z") },
    create: {
      title: "Chevening Scholarships",
      description: "Fully funded UK Masters scholarships for future leaders from eligible countries including all African nations. Covers tuition, living costs, flights, and visa.",
      provider: "UK Foreign, Commonwealth & Development Office",
      sourceUrl: "https://www.chevening.org/scholarships/",
      sourceDomain: "chevening.org",
      amount: null,
      currency: "GBP",
      deadline: new Date("2026-11-05T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: [],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Open to citizens of Chevening-eligible countries who have at least 2 years of work experience and an undergraduate degree.",
      eligibilityParsed: {
        minWorkExperience: "2 years",
        degreeRequired: "undergraduate",
        nationalityRule: "eligible country citizen",
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 2
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/" },
    update: { deadline: new Date("2026-10-31T00:00:00.000Z") },
    create: {
      title: "DAAD Scholarships for Development-Related Postgraduate Courses",
      provider: "German Academic Exchange Service (DAAD)",
      sourceUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/",
      sourceDomain: "daad.de",
      description: "Fully funded Masters scholarships in Germany for students from developing countries pursuing development-related programmes.",
      amount: 934,
      currency: "EUR",
      deadline: new Date("2026-10-31T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: ["Engineering", "Agriculture", "Economics", "Social Sciences", "Public Health", "Environmental Science"],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Open to graduates from developing countries with above-average academic results (min 2.5 German grade / 3.0 GPA).",
      eligibilityParsed: {
        gpaMinimum: 3.0,
        gpaScale: 4.0,
        fundingType: "full",
        nationalityRule: "developing country citizen"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 3
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://mastercardfdn.org/all/scholars/" },
    update: { deadline: new Date("2027-01-31T00:00:00.000Z") },
    create: {
      title: "Mastercard Foundation Scholars Program",
      provider: "Mastercard Foundation",
      sourceUrl: "https://mastercardfdn.org/all/scholars/",
      sourceDomain: "mastercardfdn.org",
      description: "Transformative scholarships for academically talented yet economically disadvantaged young Africans to study at partner universities.",
      amount: null,
      currency: "USD",
      deadline: new Date("2027-01-31T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.UNDERGRADUATE, DegreeLevel.MASTERS],
      fieldsOfStudy: [],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Must be African, demonstrate financial need, and show commitment to give back to their communities.",
      eligibilityParsed: {
        financialNeedRequired: true,
        nationalityRule: "African citizen",
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 4
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" },
    update: { deadline: new Date("2027-02-28T00:00:00.000Z") },
    create: {
      title: "Swedish Institute Scholarships for Global Professionals (SISGP)",
      provider: "Swedish Institute",
      sourceUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
      sourceDomain: "si.se",
      description: "Fully funded Masters scholarships in Sweden for professionals from eligible countries including sub-Saharan Africa.",
      amount: 11000,
      currency: "SEK",
      deadline: new Date("2027-02-28T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: [],
      eligibleNationalities: SUB_SAHARAN_ISO,
      eligibilityRaw: "Must hold a bachelor's degree, have minimum 3,000 hours work experience, and be a citizen of an eligible country.",
      eligibilityParsed: {
        minWorkExperienceHours: 3000,
        degreeRequired: "bachelor",
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 5
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/" },
    update: { deadline: new Date("2027-12-31T00:00:00.000Z") },
    create: {
      title: "Commonwealth Masters Scholarships",
      provider: "Commonwealth Scholarship Commission",
      sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
      sourceDomain: "cscuk.fcdo.gov.uk",
      description: "Fully funded UK Masters scholarships for citizens of low and middle income Commonwealth countries.",
      amount: null,
      currency: "GBP",
      deadline: new Date("2027-12-31T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: [],
      eligibleNationalities: COMMONWEALTH_AFRICA,
      eligibilityRaw: "Must be a citizen of a Commonwealth country and be unable to afford to study in the UK without this scholarship.",
      eligibilityParsed: {
        financialNeedRequired: true,
        nationalityRule: "Commonwealth citizen",
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 6
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en" },
    update: { deadline: new Date("2026-12-15T00:00:00.000Z") },
    create: {
      title: "Erasmus Mundus Joint Masters",
      provider: "European Commission",
      sourceUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
      sourceDomain: "eacea.ec.europa.eu",
      description: "Prestigious fully funded Masters programmes across multiple European universities. Open to students worldwide including all Africans.",
      amount: 1400,
      currency: "EUR",
      deadline: new Date("2026-12-15T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: ["Computer Science", "Engineering", "Environmental Science", "Economics", "Public Health", "Law"],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Open to students worldwide who hold a recognised bachelor's degree. Selection is based on academic merit.",
      eligibilityParsed: {
        gpaMinimum: null,
        nationalityRule: "worldwide",
        fundingType: "full",
        degreeRequired: "bachelor"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 7
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.vliruos.be/en/scholarships" },
    update: { deadline: new Date("2026-12-01T00:00:00.000Z") },
    create: {
      title: "VLIR-UOS Scholarships",
      provider: "Flemish Interuniversity Council (VLIR-UOS)",
      sourceUrl: "https://www.vliruos.be/en/scholarships",
      sourceDomain: "vliruos.be",
      description: "Fully funded Masters scholarships at Belgian universities for students from eligible African, Asian, and Latin American countries.",
      amount: null,
      currency: "EUR",
      deadline: new Date("2026-12-01T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: ["Agriculture", "Public Health", "Environmental Science", "Engineering", "Education", "Social Sciences"],
      eligibleNationalities: ["NG", "KE", "GH", "ET", "TZ", "UG", "RW", "BF", "ML", "SN", "BJ", "NE", "TD", "GN", "MZ", "ZM", "ZW", "CM"],
      eligibilityRaw: "Must be a national of an eligible country, hold a bachelor's degree, and intend to return to their home country after studies.",
      eligibilityParsed: {
        returnHomeRequired: true,
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 8
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.nuffic.nl/en/subjects/orange-knowledge-programme" },
    update: { deadline: new Date("2027-03-31T00:00:00.000Z") },
    create: {
      title: "Orange Knowledge Programme",
      provider: "Nuffic / Dutch Government",
      sourceUrl: "https://www.nuffic.nl/en/subjects/orange-knowledge-programme",
      sourceDomain: "nuffic.nl",
      description: "Funded short courses and Masters programmes in the Netherlands for professionals from eligible developing countries.",
      amount: null,
      currency: "EUR",
      deadline: new Date("2027-03-31T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: ["Agriculture", "Water Management", "Public Health", "Education", "Governance", "Food Security"],
      eligibleNationalities: ["NG", "ET", "KE", "GH", "RW", "BF", "ML", "SN", "MZ", "ZM", "UG", "TZ"],
      eligibilityRaw: "Must be a national and resident of an eligible country, employed, and sponsored by employer or organisation.",
      eligibilityParsed: {
        employmentRequired: true,
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 9
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://www.afdb.org/en/about/careers/presidential-fellowship-program" },
    update: { deadline: new Date("2026-11-30T00:00:00.000Z") },
    create: {
      title: "AfDB Presidential Fellowship Program",
      provider: "African Development Bank",
      sourceUrl: "https://www.afdb.org/en/about/careers/presidential-fellowship-program",
      sourceDomain: "afdb.org",
      description: "Prestigious fellowship for exceptional young African professionals combining Masters study at a top global university with placement at the AfDB.",
      amount: null,
      currency: "USD",
      deadline: new Date("2026-11-30T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.MASTERS],
      fieldsOfStudy: ["Economics", "Finance", "Engineering", "Agriculture", "Environment", "Social Sciences"],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Must be an African national under 35 years of age with a strong academic record and commitment to African development.",
      eligibilityParsed: {
        ageLimit: 35,
        gpaMinimum: null,
        nationalityRule: "African citizen",
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  // SCHOLARSHIP 10
  await prisma.scholarship.upsert({
    where: { sourceUrl: "https://mastercardfdn.org/all/scholars/becoming-a-scholar/university-of-toronto/" },
    update: { deadline: new Date("2027-01-31T00:00:00.000Z") },
    create: {
      title: "MasterCard Foundation Scholars at University of Toronto",
      provider: "Mastercard Foundation / University of Toronto",
      sourceUrl: "https://mastercardfdn.org/all/scholars/becoming-a-scholar/university-of-toronto/",
      sourceDomain: "mastercardfdn.org",
      description: "Fully funded undergraduate and graduate scholarships at University of Toronto for academically talented Africans with financial need.",
      amount: null,
      currency: "CAD",
      deadline: new Date("2027-01-31T00:00:00.000Z"),
      eligibleDegrees: [DegreeLevel.UNDERGRADUATE, DegreeLevel.MASTERS, DegreeLevel.PHD],
      fieldsOfStudy: [],
      eligibleNationalities: ALL_AFRICAN_ISO,
      eligibilityRaw: "Must be African, demonstrate exceptional academic achievement and financial need.",
      eligibilityParsed: {
        financialNeedRequired: true,
        nationalityRule: "African citizen",
        gpaMinimum: null,
        fundingType: "full"
      },
      verified: true,
      isActive: true,
      lastCrawledAt: now,
    }
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

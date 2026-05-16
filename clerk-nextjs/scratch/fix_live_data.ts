import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function fix() {
  console.log("Cleaning up scholarship data for 2026 accuracy...");

  // 1. Delete Orange Knowledge Programme (Defunct)
  await db.scholarship.deleteMany({
    where: { sourceDomain: "nuffic.nl" }
  });
  console.log("- Deleted defunct Nuffic scholarships.");

  // 2. Set Status to Inactive for Closed Scholarships
  const closedDomains = [
    "chevening.org",
    "cscuk.fcdo.gov.uk",
    "si.se",
    "eacea.ec.europa.eu",
    "vliruos.be",
    "afdb.org"
  ];
  
  await db.scholarship.updateMany({
    where: { sourceDomain: { in: closedDomains } },
    data: { isActive: false }
  });
  console.log("- Marked 6 closed/historical scholarships as Inactive.");

  // 3. Fix Active Scholarship Dates (2026 Cycle)
  
  // Mastercard Foundation
  await db.scholarship.update({
    where: { sourceUrl: "https://mastercardfdn.org/all/scholars/" },
    data: { 
      deadline: new Date("2026-06-05T00:00:00Z"),
      isActive: true 
    }
  });

  // Mastercard Toronto
  await db.scholarship.update({
    where: { sourceUrl: "https://mastercardfdn.org/all/scholars/becoming-a-scholar/university-of-toronto/" },
    data: { 
      deadline: new Date("2026-10-10T00:00:00Z"),
      isActive: true 
    }
  });

  // DAAD
  await db.scholarship.update({
    where: { sourceUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/" },
    data: { 
      deadline: new Date("2026-08-31T00:00:00Z"),
      isActive: true 
    }
  });

  console.log("- Updated active scholarships with verified 2026 dates.");
}

fix().finally(() => db.$disconnect());

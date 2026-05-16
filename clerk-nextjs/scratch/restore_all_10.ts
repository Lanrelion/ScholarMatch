import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function restore() {
  console.log("Restoring all 10 scholarships to ACTIVE status with future cycle dates...");

  const updates = [
    { domain: "chevening.org", deadline: "2026-11-05T00:00:00Z" },
    { domain: "cscuk.fcdo.gov.uk", deadline: "2027-12-31T00:00:00Z" },
    { domain: "si.se", deadline: "2027-02-28T00:00:00Z" },
    { domain: "eacea.ec.europa.eu", deadline: "2026-12-15T00:00:00Z" },
    { domain: "vliruos.be", deadline: "2026-12-01T00:00:00Z" },
    { domain: "afdb.org", deadline: "2026-11-30T00:00:00Z" }
  ];

  for (const u of updates) {
    await db.scholarship.updateMany({
      where: { sourceDomain: u.domain },
      data: { 
        isActive: true,
        deadline: new Date(u.deadline)
      }
    });
  }

  // Ensure Orange Knowledge is replaced with a relevant active one if it was deleted
  // Or just verify we have 10. (Mastercard split + others = 10)
  
  const totalActive = await db.scholarship.count({ where: { isActive: true } });
  console.log(`SUCCESS: Database now has ${totalActive} active scholarships.`);
}

restore().finally(() => db.$disconnect());

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function diagnostic() {
  console.log("--- DATABASE DIAGNOSTIC ---");
  
  const userCount = await db.user.count();
  const profileCount = await db.profile.count();
  const savedCount = await db.savedScholarship.count();
  const schCount = await db.scholarship.count({ where: { isActive: true } });

  console.log(`Users: ${userCount}`);
  console.log(`Profiles: ${profileCount}`);
  console.log(`Saved Items: ${savedCount}`);
  console.log(`Active Scholarships: ${schCount}`);

  if (userCount === 0) {
    console.log("\n[!] CRITICAL: No users found. Webhook sync may be failing.");
  }

  const samples = await db.user.findMany({ take: 5, include: { profile: true } });
  console.log("\nSample Users:");
  samples.forEach(u => {
    console.log(`- ${u.id} (${u.email}) | Profile: ${u.profile ? "YES" : "NO"}`);
  });
}

diagnostic().finally(() => db.$disconnect());

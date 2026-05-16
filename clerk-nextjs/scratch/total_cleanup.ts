import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function cleanup() {
  const email = 'pedem73108@codoteam.com';
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B';

  console.log("Cleaning up all profile data for:", email);

  try {
    // 1. Delete all profiles associated with this email or ID
    await db.profile.deleteMany({
      where: {
        OR: [
          { userId: userId },
          { user: { email: email } }
        ]
      }
    });

    // 2. Ensure the User record exists but is CLEAN (no profile)
    await db.user.upsert({
      where: { id: userId },
      update: { email },
      create: { id: userId, email }
    });

    console.log("SUCCESS: Database is clean. User exists but has NO profile.");
    console.log("Lanre can now start onboarding from scratch at /onboarding/step/1");
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

cleanup().finally(() => db.$disconnect());

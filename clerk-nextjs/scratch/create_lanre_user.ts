import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function createLanre() {
  const userId = 'user_2mZ9kR3tW1xY8vQ7pL5nJ4M6B'; // Generated mock Clerk ID format
  const email = 'pedem73108@codoteam.com';
  
  try {
    const user = await db.user.upsert({
      where: { email },
      update: {},
      create: {
        id: userId,
        email,
      }
    });

    await db.profile.upsert({
      where: { userId: user.id },
      update: {
        firstName: 'Lanre',
        lastName: 'test',
      },
      create: {
        userId: user.id,
        firstName: 'Lanre',
        lastName: 'test',
      }
    });

    console.log("User and Profile created successfully!");
    console.log("User ID:", user.id);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

createLanre().finally(() => db.$disconnect());

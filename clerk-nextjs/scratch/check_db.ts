import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function run() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const all = await db.scholarship.findMany({ 
    select: { title: true } 
  });
  console.log("ALL DB COUNT:", all.length);
}
run().finally(() => db.$disconnect());

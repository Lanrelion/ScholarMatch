import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function count() {
  const active = await db.scholarship.count({ where: { isActive: true } });
  const inactive = await db.scholarship.count({ where: { isActive: false } });
  const all = await db.scholarship.findMany({ select: { title: true, isActive: true, deadline: true } });

  console.log(`TOTAL: ${all.length}`);
  console.log(`ACTIVE: ${active}`);
  console.log(`INACTIVE: ${inactive}`);
  console.log("\nSCHOLARSHIPS:");
  all.forEach(s => {
    console.log(`- [${s.isActive ? "ACTIVE" : "INACTIVE"}] ${s.title} (Deadline: ${s.deadline?.toISOString()})`);
  });
}

count().finally(() => db.$disconnect());

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './lib/db.ts';

async function main() {
  console.log("Testing connection...");
  const profile = await db.profile.findFirst();
  console.log("Profile:", profile);
}

main().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(e => {
  console.error("Error:", e);
  process.exit(1);
});

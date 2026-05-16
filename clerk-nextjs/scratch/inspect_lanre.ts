import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { db } from '../lib/db';

async function inspect() {
  const email = 'pedem73108@codoteam.com';
  const user = await db.user.findUnique({
    where: { email },
    include: { profile: true }
  });
  console.log(JSON.stringify(user, null, 2));
}

inspect().finally(() => db.$disconnect());

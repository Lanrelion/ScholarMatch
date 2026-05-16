// Prisma v7 config — connection URLs live here, not in schema.prisma
// Requires: npm install --save-dev prisma dotenv
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    // Use the direct connection (port 5432) for Prisma CLI (migrate / db push).
    // PgBouncer (port 6543) cannot run DDL statements required by Prisma.
    // At runtime, PrismaClient uses DATABASE_URL (pooled) from .env.local / .env.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});

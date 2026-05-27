require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(`ALTER TABLE "saved_scholarships" ADD COLUMN IF NOT EXISTS "deadlineDismissed" BOOLEAN NOT NULL DEFAULT false;`);
    console.log('deadlineDismissed column added successfully.');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    await client.end();
  }
}
main();

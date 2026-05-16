require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function check() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' ORDER BY ordinal_position;`);
  console.log('profiles columns:', res.rows.map(r => r.column_name));
  await client.end();
}
check().catch(console.error);

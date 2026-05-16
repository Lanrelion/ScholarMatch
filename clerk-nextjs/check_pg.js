require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function check() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'MatchReview' AND table_schema = 'public' ORDER BY ordinal_position;`);
  console.log('MatchReview columns:', res.rows);
  const res2 = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'match_reviews' AND table_schema = 'public' ORDER BY ordinal_position;`);
  console.log('match_reviews columns:', res2.rows);
  await client.end();
}
check().catch(console.error);

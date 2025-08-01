const { Client } = require('pg');

const client = new Client({
  host: 'yumqvqrogrpghwiuameb.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'ccnpCcie1!sase',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Current Time:', res.rows[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await client.end();
  }
}

testConnection();

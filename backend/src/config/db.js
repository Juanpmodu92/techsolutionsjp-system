import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const db = new Pool({
  connectionString: env.databaseUrl
});

export async function testDatabaseConnection() {
  const client = await db.connect();

  try {
    const dbNameResult = await client.query('SELECT current_database() AS db_name');
    const nowResult = await client.query('SELECT NOW() AS current_time');

    return {
      dbName: dbNameResult.rows[0].db_name,
      currentTime: nowResult.rows[0].current_time
    };
  } finally {
    client.release();
  }
}
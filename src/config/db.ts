import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env);

export const db = knex ({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
    }
});

export async function getPgVersion() {
    const result = await db.raw('select version()');
    // console.log(result.rows[0].version);
    return result.rows[0].version;
  };

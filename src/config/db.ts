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

export const TABLES = {
    users: 'users',
    data: 'data',
    programs: 'programs',
    strava: 'strava'
};

export async function getPgVersion() {
    const result = await db.raw('select version()');
    return result.rows[0].version;
};

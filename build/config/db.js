"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLES = exports.db = void 0;
exports.getPgVersion = getPgVersion;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log(process.env);
exports.db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
    }
});
exports.TABLES = {
    users: 'users',
    data: 'data',
    programs: 'programs',
    strava: 'strava'
};
async function getPgVersion() {
    const result = await exports.db.raw('select version()');
    return result.rows[0].version;
}
;

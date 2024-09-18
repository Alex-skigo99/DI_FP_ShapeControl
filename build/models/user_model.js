"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
;
exports.userModel = {
    createUser: async (userinfo) => {
        const { password } = userinfo;
        const trx = await db_1.db.transaction();
        try {
            //hash the password and insert into the' hashpwd table
            const hashPassword = await bcrypt_1.default.hash(password + "", 10);
            const [user] = await trx(db_1.TABLES.users).insert({ ...userinfo, password: hashPassword }, Object.keys(userinfo));
            await trx.commit();
            return user;
        }
        catch (error) {
            await trx.rollback();
            console.log(error);
            throw error;
        }
    },
    getUserByName: async (username = "") => {
        try {
            const user = await (0, db_1.db)(db_1.TABLES.users)
                .select('id', 'username', 'password', 'age', 'gender', 'height', 'strava_id')
                .where({ username })
                .first();
            return user;
        }
        catch (error) {
            throw error;
        }
    },
    updateRefreshToken: async (refresh, userid) => {
        try {
            await (0, db_1.db)(db_1.TABLES.users)
                .update({ refresh_token: refresh })
                .where({ id: userid });
            // return user;
        }
        catch (error) {
            throw error;
        }
    },
    updateUser: async (userdata) => {
        try {
            await (0, db_1.db)(db_1.TABLES.users)
                .update(userdata)
                .where({ id: userdata.id });
            // return user;
        }
        catch (error) {
            throw error;
        }
    },
    createStravaConnect: async (user_id, scope, data) => {
        const { access_token, refresh_token, expires_at } = data;
        const trx = await db_1.db.transaction();
        try {
            const [stravaData] = await trx(db_1.TABLES.strava)
                .insert({ access_token, refresh_token, expires_at, scope }, ['access_token', 'refresh_token', 'expires_at', 'scope'])
                .returning('id');
            await trx(db_1.TABLES.users)
                .update({ strava_id: stravaData.id })
                .where({ id: user_id }); //update user with strava_id
            await trx.commit();
            return stravaData;
        }
        catch (error) {
            await trx.rollback();
            console.log(error);
            throw error;
        }
    },
    updateStravaData: async (userid, access_token, expires_at, refresh_token) => {
        try {
            const [stravaData] = await (0, db_1.db)(db_1.TABLES.strava)
                .update({ access_token, expires_at, refresh_token })
                .where('id', (0, db_1.db)(db_1.TABLES.users).select('strava_id').where({ id: userid }))
                .returning('id');
            console.log('updateStravaData - stravaData: ', stravaData); //--------------
            return stravaData;
        }
        catch (error) {
            throw error;
        }
    },
    getStravaData: async (userid) => {
        try {
            const [stravaData] = await (0, db_1.db)(db_1.TABLES.strava)
                .where('id', (0, db_1.db)(db_1.TABLES.users).select('strava_id').where({ id: userid }));
            console.log('getStravaData - stravaData: ', stravaData); //--------------
            return stravaData;
        }
        catch (error) {
            throw error;
        }
    }
};

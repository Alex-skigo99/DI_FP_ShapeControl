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
        // try {
        //   await db(TABLES.users)
        //   .update(userdata)
        //   .where({id: userdata.id});
        //   // return user;
        // } catch (error) {
        //   throw error;
        // }
    },
    // getAllUsers: async () => {
    //   try {
    //     const users = await db(TABLES.users);
    //     return users;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
    // getUserById: async (id: number) => {
    //   try {
    //     const [user] = await db(TABLES.users).where({ id });
    //     return user;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
};

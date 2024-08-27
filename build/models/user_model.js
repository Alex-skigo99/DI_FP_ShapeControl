"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const db_1 = require("../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_obj = {
    id: 0,
    username: '',
    password: '',
    token: '',
    refresh_token: '',
    email: '',
    gender: '',
    age: 0,
    height: 0,
    strava_id: 0
};
exports.userModel = {
    createUser: async (userinfo) => {
        const { password } = userinfo;
        const trx = await db_1.db.transaction();
        try {
            //hash the password and insert into the' hashpwd table
            const hashPassword = await bcrypt_1.default.hash(password + "", 10);
            const [user] = await trx(db_1.TABLES.users).insert({ ...userinfo, password: hashPassword }, Object.keys(user_obj));
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
                //   .select(...Object.keys(user_obj))
                .where({ username })
                .first();
            return user;
        }
        catch (error) {
            throw error;
        }
    },
    getAllUsers: async () => {
        try {
            const users = await (0, db_1.db)(db_1.TABLES.users);
            return users;
        }
        catch (error) {
            throw error;
        }
    },
    getUserById: async (id) => {
        try {
            const [user] = await (0, db_1.db)(db_1.TABLES.users).where({ id });
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
};

import { db, TABLES } from "../config/db";
import bcrypt from 'bcrypt';

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
export type User = typeof user_obj;

export const userModel = {
    createUser: async (userinfo: Partial<User>) => {
      const { password } = userinfo;
  
      const trx = await db.transaction();
  
      try {
        //hash the password and insert into the' hashpwd table
        const hashPassword = await bcrypt.hash(password + "", 10);
  
        const [user] = await trx(TABLES.users).insert(
          { ...userinfo, password: hashPassword },
          Object.keys(user_obj)
        );
  
        await trx.commit();
  
        return user;
      } catch (error) {
        await trx.rollback();
        console.log(error);
        throw error;
      }
    },
  
    getUserByName: async (username = "") => {
      try {
        const user = await db(TABLES.users)
        //   .select(...Object.keys(user_obj))
          .where({username})
          .first();
        return user;
      } catch (error) {
        throw error;
      }
    },
  
    getAllUsers: async () => {
      try {
        const users = await db(TABLES.users);
        return users;
      } catch (error) {
        throw error;
      }
    },
  
    getUserById: async (id: number) => {
      try {
        const [user] = await db(TABLES.users).where({ id });
        return user;
      } catch (error) {
        throw error;
      }
    },
  
    updateRefreshToken: async (refresh: string, userid:number) => {
      try {
        await db(TABLES.users)
          .update({ refresh_token: refresh })
          .where({id: userid});
        // return user;
      } catch (error) {
        throw error;
      }
    },
  };

import { db, TABLES } from "../config/db";
import bcrypt from 'bcrypt';

export interface User {
    id?: number;
    username: string;
    password?: string;
    // email: string;
    gender: string;
    age: number;
    height: number;
    strava_id?: number;
  };

export const userModel = {

    createUser: async (userinfo: User) => {
      const { password } = userinfo;
  
      const trx = await db.transaction();
  
      try {
        //hash the password and insert into the' hashpwd table
        const hashPassword = await bcrypt.hash(password + "", 10);
  
        const [user] = await trx(TABLES.users).insert(
          { ...userinfo, password: hashPassword },
          Object.keys(userinfo)
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
          .select('id', 'username', 'password', 'age', 'gender', 'height', 'strava_id')
          .where({username})
          .first();
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

    updateUser: async (userdata :User) => {
      try {
        await db(TABLES.users)
        .update(userdata)
        .where({id: userdata.id});
        // return user;
      } catch (error) {
        throw error;
      }
    },

    createStravaConnect: async (user_id: number, scope: string, data: any) => {
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

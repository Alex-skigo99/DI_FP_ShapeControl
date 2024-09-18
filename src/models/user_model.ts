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

    createStravaConnect: async (user_id: number, scope: boolean, data: any) => {
      const { access_token, refresh_token, expires_at } = data;
      const trx = await db.transaction();
      try {
        const [stravaData] = await trx(TABLES.strava)
          .insert({ access_token, refresh_token, expires_at, scope },
          ['access_token', 'refresh_token', 'expires_at', 'scope']
          )
          .returning('id'); 
        await trx(TABLES.users)
          .update({ strava_id: stravaData.id })
          .where({ id: user_id }); //update user with strava_id
        await trx.commit();
        return stravaData;
      } catch (error) {
        await trx.rollback();
        console.log(error);
        throw error;
      }
    },

    updateStravaData: async (userid: number, access_token: string, expires_at: number, refresh_token: string) => {
      try {
        const [stravaData] = await db(TABLES.strava)
          .update({ access_token, expires_at, refresh_token })
          .where('id', db(TABLES.users).select('strava_id').where({ id: userid }))
          .returning('id');
          console.log('updateStravaData - stravaData: ', stravaData); //--------------
        return stravaData;
      } catch (error) {
        throw error;
      }
    },

    getStravaData: async (userid: number) => {
      try {
        const [stravaData] = await db(TABLES.strava)
          .where('id', db(TABLES.users).select('strava_id').where({ id: userid }))
        console.log('getStravaData - stravaData: ', stravaData); //--------------
        return stravaData;
      } catch (error) {
        throw error;
      }
    }
  };

import { Request, Response } from "express";
import dotenv from 'dotenv';
import { userModel } from "../models/user_model";
dotenv.config();

const stravaOAuthUrl = 'https://www.strava.com/oauth/token';
const stravaApiUrl = 'https://www.strava.com/api/v3/athlete/activities';
  
export const stravaController = {
    // connect to strava
    stravaConnect: async (req: Request, res: Response) => {
        const { code, state, scope } = req.query;
        console.log('stravaConnect - code:', code, 'state:', state, 'scope', scope); //-------------------
        let url = stravaOAuthUrl;
        url += '?client_id=' + process.env.STRAVA_CLIENT_ID;
        url += '&client_secret=' + process.env.STRAVA_CLIENT_SECRET;
        url += '&code=' + code;
        url += '&grant_type=authorization_code';
        console.log('stravaConnect - url:', url); //-------------------
        try {
          const response = await fetch(url, { method: 'POST' });
          const data = await response.json();
          console.log('stravaConnect - data:', data); //-------------------
          let is_scope = false;
          if (typeof scope === 'string' && scope.includes('activity:read_all')) {
            is_scope = true;
          };
          const stravaData = await userModel.createStravaConnect(Number(state), is_scope, data);
          if (typeof stravaData.id === 'number') {
            res.status(201).json({ message: 'Strava connected successfully' });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "internal server error" });
        }
      }, 

    // get data from strava
    stravaGetData: async (req: Request, res: Response) => {
        console.log('strava-req.query:', req.query); //--------------
        const userid = Number(req.query.userid);
        const after = Number(req.query.after);
        const befor = Math.min(Number(req.query.befor), Date.now() / 1000);

        // check if strava access_token is expired
        const isStravaTokenExpired = (expires_at: number) => {
            const currentEpochTime = Date.now() / 1000;
            return currentEpochTime > expires_at;
        };
        
        // fetch new strava tokens using refresh_token
        const getNewStravaToken = async (refresh_token: string) => {
            let url = stravaOAuthUrl;
            url += '?client_id=' + process.env.STRAVA_CLIENT_ID;
            url += '&client_secret=' + process.env.STRAVA_CLIENT_SECRET;
            url += '&refresh_token=' + refresh_token;
            url += '&grant_type=refresh_token';
            console.log('getNewStravaToken - url:', url); //-------------------
            try {
                const response = await fetch(url, { method: 'POST' });
                const data = await response.json();
                console.log('getNewStravaToke - data:', data); //-------------------
                return data;
            } catch (error) {
                console.log(error);
                return null;
            }
        };

        // update strava tokens in database
        const updateStravaToken = async (userid: number, data: any) => {
            const {access_token, expires_at, refresh_token} = data;
            try {
                const stravaData = await userModel.updateStravaData(userid, access_token, expires_at, refresh_token);
                if (typeof stravaData.id === 'number') {
                    console.log('strava token updated successfully'); //-------------------
                    return true;
                }
                return false;
            } catch (error) {
                console.log(error);
                return false;
            }
        };
        // fetch strava activities
        const getStravaActivities = async (userid: number, after: number, befor: number, access_token: string) => {
            let url = stravaApiUrl;
            url += '?befor=' + befor;
            url += '&after=' + after;
            url += '&page=1&per_page=10';
            console.log('strava - url:', url); //-------------------
            try {
              const response = await fetch(url, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                    'Authorization': 'Bearer ' + access_token // Optional authorization header
                  }
             });
              const activities = await response.json();
              console.log('getStravaActivities - data:', activities); //-------------------
              return activities
            } catch (error) {
              console.log(error);
              return { message: "internal server error" };
            }        
        }
        //main logic
        try {
            // get strava tokens from database
            const {access_token, expires_at, refresh_token, scope} = await userModel.getStravaData(userid);
            if (scope) {
                if (isStravaTokenExpired(expires_at)) { // check if token is expired
                    console.log('strava access-token expired'); //-------------------
                    const newTokens = await getNewStravaToken(refresh_token); // fetch new tokens
                    if (newTokens) {
                        const updated = await updateStravaToken(userid, newTokens); // update tokens in database
                        if (updated) {
                            // fetch activities from strava using new tokens
                            const activities = await getStravaActivities(userid, after, befor, newTokens.access_token);
                            res.status(200).json(activities);
                        } else {
                            res.status(500).json({ message: "internal database error" });
                        }
                    } else {
                        res.status(500).json({ message: "New token get error" });
                    }
                } else {
                    // if token is not expired fetch activities from strava using existing tokens
                    console.log('strava access-token NOT expired'); //-------------------
                    const activities = await getStravaActivities(userid, after, befor, access_token);
                    res.status(200).json(activities);
                }
            } else {
                res.status(403).json({ message: "Strava scope error" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal database error" });
        }
    },

};

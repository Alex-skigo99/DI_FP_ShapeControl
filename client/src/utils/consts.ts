// const API_URL = import.meta.env.VITE_APP_API_URL;
// const USER_URL = import.meta.env.VITE_APP_USER_URL;
const API_URL = '/api/';
const USER_URL = '/user/';

export const API = {
    hello: API_URL + 'hello',
    ai: API_URL + 'gpt',
    programs: API_URL + 'programs',
    strava: API_URL + 'strava',

    login: USER_URL + 'login',  // post
    logout: USER_URL + 'logout',  // get
    register: USER_URL,  // post
    update: USER_URL,  // patch
    // allUsers: USER_URL + 'all',
    // userById: USER_URL,
    auth: USER_URL + 'auth',
    stravaConnect: USER_URL + 'stravaconnect', // get
};
export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export type LevelType = 'stable' | 'progress' | 'jump';
export type LevelIdxType = {
    [key in LevelType]: number;
  };

export const activityIndex = 1.3;

export interface User {
    id?: number,
    username: string,
    password?: string,
    email?: string,
    gender: string,
    age: number,
    height: number,
    strava_id?: number 
};

export const stravaSignupParameters = {
    client_id: import.meta.env.VITE_APP_STRAVA_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_APP_STRAVA_REDIRECT_URI as string,
    response_type: 'code',
    approval_prompt: 'force',
    scope: 'activity:read_all',
    // state: user_id
};
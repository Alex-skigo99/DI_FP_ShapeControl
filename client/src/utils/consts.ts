// const API_URL = import.meta.env.VITE_APP_API_URL;
// const USER_URL = import.meta.env.VITE_APP_USER_URL;
const API_URL = '/api/';
const USER_URL = '/user/';

export const API = {
    hello: API_URL + 'hello',
    ai: API_URL + 'gpt',
    programs: API_URL + 'programs',
    login: USER_URL + 'login',
    logout: USER_URL + 'logout',
    register: USER_URL + 'register',
    allUsers: USER_URL + 'all',
    userById: USER_URL,
    auth: USER_URL + 'auth'
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
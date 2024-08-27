const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_URL = import.meta.env.VITE_APP_USER_URL;

export const API = {
    hello: API_URL + 'hello',
    login: USER_URL + 'login',
    register: USER_URL + 'register',
    allUsers: USER_URL + 'all',
    userById: USER_URL,
    auth: USER_URL + 'auth'
};

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
export type User = Partial<typeof user_obj>;

import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../utils/consts';
import { RootState } from '../../app/store';
import { API } from '../../utils/consts';

interface InitialStateType {
    currentUser: User | undefined,
    loading: boolean,
    error: SerializedError | null
};

const initialState: InitialStateType = {
    currentUser: undefined,
    loading: false,
    error: null
};

export const signinPost = createAsyncThunk(
    'auth/signinPost',
    async (loginData: { username: string, password: string }, thunkAPI) => {
        try {
            const response = await axios.post(
                API.login,
                loginData,
                { withCredentials: true }
            );
            return response.data
        } catch (err) {
            return thunkAPI.rejectWithValue("Login failed");
        }
    }
); 

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async ( userData: User, thunkAPI) => {
        try {
            await axios.patch(
                API.update,
                userData,
                { withCredentials: true }
            );
            return userData
        } catch (err) {
            return thunkAPI.rejectWithValue("Update failed");
        }
    }
);  

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.currentUser = undefined;
            localStorage.removeItem('user');
            axios.get(API.logout);
        },
        resetUserSliceStatus: (state) => {
            state.loading = false;
            state.error = null;
        },
        setStrava: (state) => {
            if (state.currentUser) {
                state.currentUser.strava_id = 1000000;
                localStorage.setItem('user', JSON.stringify({...state.currentUser, strava_id: 1000000}));
            }
        },
        setCurrentUser: (state, action) => {
                console.log('setCurrentUser-payload:', action.payload); //---------------
                state.currentUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(signinPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signinPost.fulfilled, (state, action) => {
            state.loading = false;
            // state.error = null;
            state.currentUser = action.payload.user;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
        .addCase(signinPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },

});

export const getCurrentUser = (state: RootState) => state.userReducer.currentUser;
export const getUserLoading = (state: RootState) => state.userReducer.loading;
export const getUserError = (state: RootState) => state.userReducer.error;
export const {logout, resetUserSliceStatus, setStrava, setCurrentUser} = userSlice.actions;
export default userSlice.reducer;

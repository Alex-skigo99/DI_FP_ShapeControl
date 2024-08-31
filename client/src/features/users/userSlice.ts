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

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.currentUser = undefined;
            const response = axios.get(API.logout);
            console.log('logout-response- ', response);
        },
        resetUserSliceStatus: (state) => {
            state.loading = false;
            state.error = null;
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
        })
        .addCase(signinPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;
        });
    },

});

export const getCurrentUser = (state: RootState) => state.userReducer.currentUser;
export const {logout, resetUserSliceStatus} = userSlice.actions;
export default userSlice.reducer;

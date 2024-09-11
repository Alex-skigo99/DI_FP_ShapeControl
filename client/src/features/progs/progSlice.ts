import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { API } from '../../utils/consts';

export type progSliceStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface Day {
    id?: number, 
    day: string,
    date?: string | Date, 
    plan: number, 
    fact?: number, 
    strava?: number, 
    is_training: boolean,
    workout: string,
    comment: string,
    prog_id?: number
};
export interface Program {
    id?: number,
    progname: string,
    level: string,
    in_weight: number, 
    out_weight?: number, 
    is_close?: boolean, 
    progcomment: string,
    grade?: string,
    tips?: string,
    menu?: string,
    user_id: number,
    days: Day[]
};
interface InitialStateType {
    programs: Program[] | undefined,
    currentProgram: Program | undefined,
    status: progSliceStatus,
};
const initialState: InitialStateType = {
    programs: undefined,
    currentProgram: undefined,
    status: 'idle',
};

export const fetchProgs = createAsyncThunk(
    'progs/fetchProgs',
    async (userid: number, thunkAPI) => {
        try {
            const response = await axios.get(
                API.programs + '?userid=' + userid,
                { withCredentials: true }
            );
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue("Fetch programs failed");
        }
    }
);  
export const postProg = createAsyncThunk(
    'progs/postProg',
    async (progData: Program, thunkAPI) => {
        try {
            const response = await axios.post(
                API.programs,
                progData,
                { withCredentials: true }
            );
            return response.data
        } catch (err) {
            return thunkAPI.rejectWithValue("Post programs failed");
        }
    }
);  
export const patchProg = createAsyncThunk(
    'progs/patchProg',
    async (progData: Program, thunkAPI) => {
        try {
            const response = await axios.patch(
                API.programs,
                progData,
                { withCredentials: true }
            );
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue("Patch programs failed");
        }
    }
);  

const progSlice = createSlice({
    name: 'progs',
    initialState,
    reducers:{
        resetStatus: (state) => {
            state.status = 'idle';
        },
        setCurrentProg: (state, action) => {
            if (state.programs) {
                state.currentProgram = state.programs[action.payload]
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProgs.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchProgs.fulfilled, (state, action) => {
            let status = action.payload.status;
            console.log('slice-status- ', status);  //---------------
            if (status === 200) {
                state.status = 'idle';
                console.log('slice-data- ', action.payload.data); //-------------
                state.programs = action.payload.data;
            }
            else {
                state = initialState;
            }
        })
        .addCase(fetchProgs.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(postProg.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postProg.fulfilled, (state, action) => {
            state.status = 'succeeded';
            console.log('post action-payload: ', action.payload); //-------------------
            state.programs? state.programs.push(action.payload) : state.programs = [action.payload];
        })
        .addCase(postProg.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(patchProg.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(patchProg.fulfilled, (state, action) => {
            state.status = 'succeeded';
            console.log('patch action-payload: ', action.payload); //-------------------
        })
        .addCase(patchProg.rejected, (state) => {
            state.status = 'failed';
        })
    },

});

export const getPrograms = (state: RootState) => state.progReducer.programs;
export const getCurrentProgram = (state: RootState) => state.progReducer.currentProgram;
export const {resetStatus, setCurrentProg} = progSlice.actions;
export default progSlice.reducer;

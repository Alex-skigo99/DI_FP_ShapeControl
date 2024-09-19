import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { API } from '../../utils/consts';
import { api } from '../../utils/http_requests';
import { dataDayStrava, handleStravaResponse } from '../../utils/handleStravaResponse';

export type progSliceStatus = 'idle' | 'loading' | 'succeeded' | 'loaded' | 'failed';

export interface Day {
    id?: number, 
    day: string,
    date?: string, 
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
            console.log('patchProg - progData: ', progData); //-------------------
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
export const getStravaActivities = createAsyncThunk(
    'progs/getStravaActivities',
    async (url: string, thunkAPI) => {
        try {
            console.log('getStravaActivities - url: ', url); //-------------------
            const response: [] | undefined = await api.get_credentials(url)
            console.log('getStravaActivities - response: ', response); //-------------------
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue("getStravaActivities failed");
        }
    }
);  
export const getMenuFromGPT = createAsyncThunk(
    'progs/getMenuFromGPT',
    async (url: string, thunkAPI) => {
        try {
            const response: any = await api.get_credentials(url)
            return response
        } catch (err) {
            return thunkAPI.rejectWithValue("getMenuFromGPT failed");
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
            action.payload === undefined ? state.currentProgram = undefined 
            : state.currentProgram = state.programs && state.programs[action.payload]
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
            state.programs = action.payload.data;

        })
        .addCase(patchProg.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(getMenuFromGPT.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getMenuFromGPT.fulfilled, (state, action) => {
            state.status = 'loaded';
            console.log('gpt action-payload: ', action.payload); //-------------------
            if (state.currentProgram) {state.currentProgram.menu = action.payload.content}
            else {console.log('getMenuFromGPT-currentProgram is undefined');}
        })
        .addCase(getMenuFromGPT.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(getStravaActivities.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getStravaActivities.fulfilled, (state, action) => {
            state.status = 'loaded';
            console.log('strava action-payload: ', action.payload); //-------------------
            if (action.payload) {
                if (state.currentProgram && state.currentProgram.days[0].date) {
                     // get kCal and about info from res array
                    let dataStrava: dataDayStrava[] = handleStravaResponse(action.payload, state.currentProgram.days[0].date);
                    console.log('fullfiled-dataStrava: ', dataStrava); //----------------
                    let dataStravaLength = dataStrava.length; 
                    let new_days: Day[] = state.currentProgram?.days.map((item, index) => { // add kCal and about info to days
                        if (index < dataStravaLength) {
                            return {
                                ...item,
                                strava: dataStrava[index].kCal,
                                comment: item.comment + dataStrava[index].about
                            }
                        } else {
                            return item;
                        }
                    });
                    console.log('fullfiled-new_days: ', new_days); //----------------
                    state.currentProgram.days = new_days;
                } else {
                    console.log('currentProgram or date is undefined'); //----------------
                }
            } else {
                console.log('response from server is undefined'); //----------------
            }

        })
        .addCase(getStravaActivities.rejected, (state) => {
            state.status = 'failed';
        })
    },

});

export const getPrograms = (state: RootState) => state.progReducer.programs;
export const getCurrentProgram = (state: RootState) => state.progReducer.currentProgram;
export const {resetStatus, setCurrentProg} = progSlice.actions;
export default progSlice.reducer;

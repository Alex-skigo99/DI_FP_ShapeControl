import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';
import progReducer from '../features/progs/progSlice';

export const rootReducer = combineReducers({
  userReducer,
  progReducer
});

const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
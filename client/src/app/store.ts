import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from '../features/users/userSlice';

export const rootReducer = combineReducers({
  userReducer
});

const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
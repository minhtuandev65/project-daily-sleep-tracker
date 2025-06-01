import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { LoadingReducer } from "./Reducer/LoadingReducer/LoadingReducer";
import { AuthReducer } from "./Reducer/AuthReducer/AuthReducer";
import { SleepRecordsReducer } from "./Reducer/UsersReducer/SleepRecordsReducer/SleepRecordsReducer";

const rootReducer = combineReducers({
  // Loading reducer
  LoadingReducer,
  // Auth reducer
  AuthReducer,
  // User reducer
  SleepRecordsReducer
});

export const store = configureStore({
  reducer: rootReducer,
});

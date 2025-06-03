import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { LoadingReducer } from "./Reducer/LoadingReducer/LoadingReducer";
import { AuthReducer } from "./Reducer/AuthReducer/AuthReducer";
import { SleepTrackersReducer } from "./Reducer/UsersReducer/SleepTrackersReducer/SleepTrackersReducer";

const rootReducer = combineReducers({
  // Loading reducer
  LoadingReducer,
  // Auth reducer
  AuthReducer,
  // User reducer
  SleepTrackersReducer
});

export const store = configureStore({
  reducer: rootReducer,
});

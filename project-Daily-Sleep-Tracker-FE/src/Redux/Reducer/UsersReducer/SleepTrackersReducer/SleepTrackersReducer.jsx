import {
  SET_GET_SLEEP_TRACKERS_BY_USERID,
  SET_GET_SLEEP_TRACKERS_BY_DAYS,
} from "../../../type/UserType/sleepTrackersType/sleepTrackersType";

const initialState = {
  sleepTrackersByUserId: [],
  sleepTrackersByDays: [],
};

export const SleepTrackersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GET_SLEEP_TRACKERS_BY_USERID:
      return { ...state, sleepTrackersByUserId: action.payload };
    case SET_GET_SLEEP_TRACKERS_BY_DAYS:
      return { ...state, sleepTrackersByDays: action.payload };
    default:
      return state;
  }
};

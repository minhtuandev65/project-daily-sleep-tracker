import { SleepTrackersReducer } from "./SleepTrackersReducer";
import {
  SET_GET_SLEEP_TRACKERS_BY_USERID,
  SET_GET_SLEEP_TRACKERS_BY_DAYS,
} from "../../../type/UserType/sleepTrackersType/sleepTrackersType";

describe("SleepTrackersReducer", () => {
  const initialState = {
    sleepTrackersByUserId: [],
    sleepTrackersByDays: [],
  };

  it("should return the initial state", () => {
    const newState = SleepTrackersReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it("should handle SET_GET_SLEEP_TRACKERS_BY_USERID", () => {
    const mockData = [{ date: "2025-06-05", duration: 8 }];
    const action = {
      type: SET_GET_SLEEP_TRACKERS_BY_USERID,
      payload: mockData,
    };
    const newState = SleepTrackersReducer(initialState, action);
    expect(newState.sleepTrackersByUserId).toEqual(mockData);
    expect(newState.sleepTrackersByDays).toEqual([]);
  });

  it("should handle SET_GET_SLEEP_TRACKERS_BY_DAYS", () => {
    const mockData = [
      { date: "2025-06-04", duration: 7 },
      { date: "2025-06-05", duration: 8 },
    ];
    const action = {
      type: SET_GET_SLEEP_TRACKERS_BY_DAYS,
      payload: mockData,
    };
    const newState = SleepTrackersReducer(initialState, action);
    expect(newState.sleepTrackersByDays).toEqual(mockData);
    expect(newState.sleepTrackersByUserId).toEqual([]);
  });

  it("should return current state for unknown action type", () => {
    const action = { type: "UNKNOWN_TYPE", payload: [] };
    const newState = SleepTrackersReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

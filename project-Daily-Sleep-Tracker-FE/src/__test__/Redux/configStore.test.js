import { store } from "../../Redux/configStore"; // thay bằng đường dẫn đúng
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../../Redux/Actions/LoadingAction/LoadingAction";

describe("Redux Store", () => {
  it("should have the expected initial state", () => {
    const state = store.getState();
    expect(state.LoadingReducer).toBeDefined();
    expect(state.AuthReducer).toBeDefined();
    expect(state.SleepTrackersReducer).toBeDefined();
  });

  it("should update LoadingReducer state correctly", () => {
    store.dispatch(displayLoadingAction);
    let state = store.getState();
    expect(state.LoadingReducer.isLoading).toBe(true); // dùng isLoading

    store.dispatch(hideLoadingAction);
    state = store.getState();
    expect(state.LoadingReducer.isLoading).toBe(false);
  });

  // Optional: test SleepTrackersReducer nếu có action đơn giản
  it("should update SleepTrackersReducer when SET_GET_SLEEP_TRACKERS_BY_USERID dispatched", () => {
    const sampleData = [{ _id: "1", duration: 8 }];
    store.dispatch({
      type: "SET_GET_SLEEP_TRACKERS_BY_USERID",
      payload: sampleData,
    });

    const state = store.getState();
    expect(state.SleepTrackersReducer.sleepTrackersByUserId).toEqual(
      sampleData
    );
  });

  // Optional: test AuthReducer nếu có action đơn giản
  it("should update AuthReducer when SET_LOGIN dispatched", () => {
    const user = { username: "tuan", token: "123abc" };
    store.dispatch({
      type: "SET_LOGIN",
      payload: user,
    });

    const state = store.getState();
    expect(state.AuthReducer.user).toEqual(user); // dùng user
  });
  it("should update AuthReducer when SET_GET_MY_PROFILE dispatched", () => {
    const profile = { name: "Tuan", age: 25 };
    store.dispatch({
      type: "SET_GET_MY_PROFILE",
      payload: profile,
    });

    const state = store.getState();
    expect(state.AuthReducer.userProfile).toEqual(profile);
  });
});

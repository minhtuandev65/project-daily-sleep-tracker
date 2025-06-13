import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  getSleepTrackersByUserIdAction,
  createNewSleepTrackersAction,
  getSleepTrackersByDaysAction,
  updateSleepTrackerAction,
} from "../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction"; // Đổi path đúng
import {
  SET_GET_SLEEP_TRACKERS_BY_USERID,
  SET_GET_SLEEP_TRACKERS_BY_DAYS,
} from "../../../Redux/type/UserType/sleepTrackersType/sleepTrackersType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../../../Redux/Actions/LoadingAction/LoadingAction";
import { sleepTrackersServices } from "../../../Services/UserServices/SleepTrackersServices/SleepTrackersServices";
import { notificationFunction } from "../../../Utils/libs/Notification";

// Mock store setup
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock các service
jest.mock(
  "../../../Services/UserServices/SleepTrackersServices/SleepTrackersServices"
);
jest.mock("../../../Utils/libs/Notification");

describe("sleepTrackersAction", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  it("should dispatch correct actions when getSleepTrackersByUserIdAction is successful", async () => {
    const mockData = [{ _id: "1", duration: 8 }];
    sleepTrackersServices.getSleepTrackersByUserId.mockResolvedValue({
      data: mockData,
    });

    await store.dispatch(getSleepTrackersByUserIdAction());

    const actions = store.getActions();
    expect(actions).toEqual([
      displayLoadingAction,
      { type: SET_GET_SLEEP_TRACKERS_BY_USERID, payload: mockData },
      hideLoadingAction,
    ]);
  });

  it("should dispatch correct actions when getSleepTrackersByDaysAction is successful", async () => {
    const days = 7;
    const mockResult = { data: [{ _id: "1", duration: 7 }] };
    sleepTrackersServices.getSleepTrackersByDays.mockResolvedValue(mockResult);

    await store.dispatch(getSleepTrackersByDaysAction(days));

    const actions = store.getActions();
    expect(actions).toEqual([
      displayLoadingAction,
      { type: SET_GET_SLEEP_TRACKERS_BY_DAYS, payload: mockResult.data },
      hideLoadingAction,
    ]);
  });

  it("should dispatch actions and notifications when createNewSleepTrackersAction is successful", async () => {
    const newTracker = { sleepTime: "22:00", wakeTime: "06:00", duration: 8 };
    const days = 7;

    sleepTrackersServices.createNewSleepTrackers.mockResolvedValue({});
    sleepTrackersServices.getSleepTrackersByDays.mockResolvedValue({
      data: [],
    });
    sleepTrackersServices.getSleepTrackersByUserId.mockResolvedValue([]);

    await store.dispatch(createNewSleepTrackersAction(newTracker, days));

    const actions = store.getActions();
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Sleep tracker created successfully!",
      "Success"
    );
    expect(actions).toContainEqual(displayLoadingAction);
    expect(actions).toContainEqual(hideLoadingAction);
  });

  it("should dispatch actions and notifications when updateSleepTrackerAction is successful", async () => {
    const trackerId = "123";
    const updateData = { duration: 7.5 };
    const days = 7;

    sleepTrackersServices.updateSleepTracker.mockResolvedValue({});
    sleepTrackersServices.getSleepTrackersByDays.mockResolvedValue({
      data: [],
    });
    sleepTrackersServices.getSleepTrackersByUserId.mockResolvedValue([]);

    await store.dispatch(updateSleepTrackerAction(trackerId, updateData, days));

    const actions = store.getActions();
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Sleep tracker updated successfully!",
      "Success"
    );
    expect(actions).toContainEqual(displayLoadingAction);
    expect(actions).toContainEqual(hideLoadingAction);
  });

  it("should handle error in getSleepTrackersByUserIdAction", async () => {
    sleepTrackersServices.getSleepTrackersByUserId.mockRejectedValue({
      response: { data: { message: "Error occurred" } },
    });

    await store.dispatch(getSleepTrackersByUserIdAction());

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Error occurred",
      "Get data failed"
    );
  });
});

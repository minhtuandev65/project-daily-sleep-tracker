import {
  SET_GET_SLEEP_TRACKERS_BY_USERID,
  SET_GET_SLEEP_TRACKERS_BY_DAYS,
} from "../../../type/UserType/sleepTrackersType/sleepTrackersType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../../LoadingAction/LoadingAction";
import { sleepTrackersServices } from "../../../../Services/UserServices/SleepTrackersServices/SleepTrackersServices";
import { notificationFunction } from "../../../../Utils/libs/Notification";

export const getSleepTrackersByUserIdAction = () => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepTrackersServices.getSleepTrackersByUserId();
      console.log("Action", result.data);
      dispatch({
        type: SET_GET_SLEEP_TRACKERS_BY_USERID,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Get data failed!";
      notificationFunction("error", message, "Get data failed");
    }
  };
};
export const createNewSleepTrackersAction = (sleepTrackersData, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await sleepTrackersServices.createNewSleepTrackers(sleepTrackersData);
      dispatch(hideLoadingAction);
      notificationFunction(
        "success",
        "Sleep tracker created successfully!",
        "Success"
      );
      dispatch(getSleepTrackersByDaysAction(days));
      dispatch(getSleepTrackersByUserIdAction());
    } catch (error) {
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Create failed!";
      notificationFunction("error", message, "Create failed");
    }
  };
};
export const getSleepTrackersByDaysAction = (days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepTrackersServices.getSleepTrackersByDays(days);
      dispatch({
        type: SET_GET_SLEEP_TRACKERS_BY_DAYS,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Get data failed!";
      notificationFunction("error", message, "Get data failed");
    }
  };
};

export const updateSleepTrackerAction = (trackerId, updateData, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await sleepTrackersServices.updateSleepTracker(trackerId, updateData);
      notificationFunction(
        "success",
        "Sleep tracker updated successfully!",
        "Success"
      );
      dispatch(hideLoadingAction);
      dispatch(getSleepTrackersByDaysAction(days));
      dispatch(getSleepTrackersByUserIdAction());
    } catch (error) {
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Update failed!";
      notificationFunction("error", message, "Update failed");
    }
  };
};

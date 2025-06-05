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
      dispatch({
        type: SET_GET_SLEEP_TRACKERS_BY_USERID,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction(
        "error",
        "Error retrieving sleep trackers by userId!",
        "Error"
      );
      dispatch(hideLoadingAction);
    }
  };
};
export const createNewSleepTrackersAction = (sleepTrackersData) => {
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
      const days = "7days";
      dispatch(getSleepTrackersByDaysAction(days));
    } catch (error) {
      notificationFunction("error", "Sleep tracker creation failed!", "Error");
      dispatch(hideLoadingAction);
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
        payload: result.data.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction(
        "error",
        "Error retrieving sleep trackers by day!",
        "Error"
      );
      dispatch(hideLoadingAction);
    }
  };
};

export const updateSleepTrackerAction = (trackerId, updateData) => {
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
      const days = "7days";
      dispatch(getSleepTrackersByDaysAction(days));
    } catch (error) {
      notificationFunction("error", "Error updating sleep tracker!", "Error");
      dispatch(hideLoadingAction);
    }
  };
};

import { message } from "antd";
import {
  SET_GET_SLEEP_TRACKERS_BY_USERID,
  SET_GET_SLEEP_TRACKERS_BY_DAYS,
  SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME,
  SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS,
  SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS,
  SET_GET_WEEKLY_AVERAGE_SLEEP,
} from "../../../type/UserType/sleepTrackersType/sleepTrackersType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../../LoadingAction/LoadingAction";
import { sleepTrackersServices } from "../../../../Services/UserServices/SleepTrackersServices/SleepTrackersServices";

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
      message.error(
        "Error retrieving sleep trackers by userId!",
        error.message
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
      message.success("Sleep tracker created successfully!");
      const days = "7days";
      dispatch(getSleepTrackersByDaysAction(days));
    } catch (error) {
      message.error("Sleep tracker creation failed!", error.message);
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
      message.error("Error retrieving sleep trackers by day!", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const getAverageSleepAndWakeTimeAction = (days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepTrackersServices.getAverageSleepAndWakeTime(
        days
      );
      dispatch({
        type: SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME,
        payload: result.data.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error(
        "Error in getting average sleep time and wake up time!",
        error.message
      );
      dispatch(hideLoadingAction);
    }
  };
};
export const countDaysWithSleepLessThan6HoursAction = (days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result =
        await sleepTrackersServices.countDaysWithSleepLessThan6Hours(days);
      dispatch({
        type: SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error(
        "Error counting days sleeping less than 6 hours!",
        error.message
      );
      dispatch(hideLoadingAction);
    }
  };
};
export const countDaysWithSleepMoreThan8HoursAction = (days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result =
        await sleepTrackersServices.countDaysWithSleepMoreThan8Hours(days);
      dispatch({
        type: SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error(
        "Error counting the number of days sleeping more than 8 hours!",
        error.message
      );
      dispatch(hideLoadingAction);
    }
  };
};
export const getAverageSleepDurationByDays = (days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepTrackersServices.getAverageSleepDurationByDays(
        days
      );
      dispatch({
        type: SET_GET_WEEKLY_AVERAGE_SLEEP,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Error in averaging weekly sleep hours!", error.message);
      dispatch(hideLoadingAction);
    }
  };
};

export const updateSleepTrackerAction = (trackerId, updateData) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await sleepTrackersServices.updateSleepTracker(trackerId, updateData);
      message.success("Sleep tracker updated successfully!");
      dispatch(hideLoadingAction);
      const days = "7days";
      dispatch(getSleepTrackersByDaysAction(days));
    } catch (error) {
      message.error("Error updating sleep tracker!", error.message);
      dispatch(hideLoadingAction);
    }
  };
};

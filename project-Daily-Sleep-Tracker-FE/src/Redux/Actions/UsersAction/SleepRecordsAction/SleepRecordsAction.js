import { message } from "antd";
import {
  SET_GET_SLEEP_RECORDS_BY_USERID,
  SET_GET_SLEEP_RECORDS_BY_DAYS,
  SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME,
  SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS,
  SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS,
  SET_GET_WEEKLY_AVERAGE_SLEEP,
} from "../../../Type/UsersType/UsersType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../../LoadingAction/LoadingAction";
import { sleepRecordsServices } from "../../../../Services/UserServices/SleepRecordsServices/SleepRecordsServices";

export const getSleepRecordsByUserIdAction = (userId) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepRecordsServices.getSleepRecordsByUserId(userId);
      dispatch({
        type: SET_GET_SLEEP_RECORDS_BY_USERID,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi lay ban ghi giac ngu theo userId", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const createNewSleepRecordsAction = (sleepRecordsData) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await sleepRecordsServices.createNewSleepRecords(sleepRecordsData);
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi tạo bản ghi giấc ngủ không thành công", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const getSleepRecordsByDaysAction = (userId, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);

      const result = await sleepRecordsServices.getSleepRecordsByDays(
        userId,
        days
      );
      dispatch({
        type: SET_GET_SLEEP_RECORDS_BY_DAYS,
        payload: result.data.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi lay ban ghi giac ngu theo ngay", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const getAverageSleepAndWakeTimeAction = (userId, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepRecordsServices.getAverageSleepAndWakeTime(
        userId,
        days
      );
      dispatch({
        type: SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME,
        payload: result.data.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi lay thoi gian ngu va day trung binh", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const countDaysWithSleepLessThan6HoursAction = (userId, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result =
        await sleepRecordsServices.countDaysWithSleepLessThan6Hours(
          userId,
          days
        );
      dispatch({
        type: SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi dem so ngay ngu it hon 6 gio", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const countDaysWithSleepMoreThan8HoursAction = (userId, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result =
        await sleepRecordsServices.countDaysWithSleepMoreThan8Hours(
          userId,
          days
        );
      dispatch({
        type: SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi dem so ngay ngu hon 8 gio", error.message);
      dispatch(hideLoadingAction);
    }
  };
};
export const getAverageSleepDurationByDays = (userId, days) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await sleepRecordsServices.getAverageSleepDurationByDays(
        userId,
        days
      );
      dispatch({
        type: SET_GET_WEEKLY_AVERAGE_SLEEP,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Loi lay trung binh giac ngu hang tuan", error.message);
      dispatch(hideLoadingAction);
    }
  };
};

import {
  SET_GET_SLEEP_RECORDS_BY_USERID,
  SET_GET_SLEEP_RECORDS_BY_DAYS,
  SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME,
  SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS,
  SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS,
  SET_GET_WEEKLY_AVERAGE_SLEEP,
} from "../../../Type/UsersType/UsersType";

const initialState = {
  sleepRecordsByUserId: [],
  sleepRecordsByDays: [],
  averageSleepAndWakeTime: {},
  countDaysWithSleepLessThan6Hours: 0,
  countDaysWithSleepMoreThan8Hours: 0,
  weeklyAverageSleep: 0,
};

export const SleepRecordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GET_SLEEP_RECORDS_BY_USERID:
      return { ...state, sleepRecordsByUserId: action.payload };
    case SET_GET_SLEEP_RECORDS_BY_DAYS:
      return { ...state, sleepRecordsByDays: action.payload };
    case SET_GET_AVERAGE_SLEEP_AND_WAKE_TIME:
      return { ...state, averageSleepAndWakeTime: action.payload };
    case SET_COUNT_DAYS_WITH_SLEEP_LESS_THAN_6_HOURS:
      return { ...state, countDaysWithSleepLessThan6Hours: action.payload };
    case SET_COUNT_DAYS_WITH_SLEEP_MORE_THAN_8_HOURS:
      return { ...state, countDaysWithSleepMoreThan8Hours: action.payload };
    case SET_GET_WEEKLY_AVERAGE_SLEEP:
      return { ...state, weeklyAverageSleep: action.payload };
    default:
      return state;
  }
};

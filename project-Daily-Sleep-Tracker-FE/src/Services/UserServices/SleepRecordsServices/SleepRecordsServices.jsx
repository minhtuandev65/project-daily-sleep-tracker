import apiClient from "../../BaseService/apiClient";
import BaseService from "../../BaseService/BaseService";

export class SleepRecordsServices extends BaseService {
  createNewSleepRecords = (sleepRecordsData) => {
    return apiClient.post(`api/sleep/sleepRecords`, sleepRecordsData);
  };
  getSleepRecordsByDays = (userId, days) => {
    return apiClient.get(
      `api/sleep/sleepRecordsByDays/${userId}?days=${days}`
    );
  };
  getSleepRecordsByUserId = (userId) => {
    return apiClient.get(`api/sleep/${userId}`);
  };
  getAverageSleepAndWakeTime = (userId, days) => {
    return apiClient.get(`api/sleep/averageSleepAndWake/${userId}?days=${days}`);
  };
  countDaysWithSleepLessThan6Hours = (userId, days) => {
    return apiClient.get(`api/sleep/countSleepLessThan6Hours/${userId}?days=${days}`);
  };
  countDaysWithSleepMoreThan8Hours = (userId, days) => {
    return apiClient.get(`api/sleep/countSleepMoreThan8Hours/${userId}?days=${days}`);
  };
  getAverageSleepDurationByDays = (userId, days) => {
    return apiClient.get(`api/sleep/weeklyAverage/${userId}?days=${days}`);
  };
}
export const sleepRecordsServices = new SleepRecordsServices();

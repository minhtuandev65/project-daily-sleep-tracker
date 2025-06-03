import apiClient from "../../BaseService/apiClient";
import BaseService from "../../BaseService/BaseService";

export class SleepTrackersServices extends BaseService {
  createNewSleepTrackers = (sleepTrackersData) => {
    return apiClient.post(`api/sleep/sleepTrackers`, sleepTrackersData);
  };
  getSleepTrackersByDays = (days) => {
    return apiClient.get(`api/sleep/sleepTrackersByDays?days=${days}`);
  };
  getSleepTrackersByUserId = () => {
    return apiClient.get(`api/sleep`);
  };
  getAverageSleepAndWakeTime = (days) => {
    return apiClient.get(`api/sleep/averageSleepAndWake?days=${days}`);
  };
  countDaysWithSleepLessThan6Hours = (days) => {
    return apiClient.get(`api/sleep/countSleepLessThan6Hours?days=${days}`);
  };
  countDaysWithSleepMoreThan8Hours = (days) => {
    return apiClient.get(`api/sleep/countSleepMoreThan8Hours?days=${days}`);
  };
  getAverageSleepDurationByDays = (days) => {
    return apiClient.get(`api/sleep/weeklyAverage?days=${days}`);
  };
  updateSleepTracker = (trakerId, updateData) => {
    return apiClient.put(`api/sleep/updateSleepTracker?trackerId=${trakerId}`,
      updateData);
  };
}
export const sleepTrackersServices = new SleepTrackersServices();

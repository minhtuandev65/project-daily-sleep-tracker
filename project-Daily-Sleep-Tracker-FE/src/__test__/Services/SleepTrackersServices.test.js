import { sleepTrackersServices } from "../../Services/UserServices/SleepTrackersServices/SleepTrackersServices";
import apiClient from "../../Services/BaseService/apiClient";

// Mock apiClient
jest.mock("../../Services/BaseService/apiClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe("SleepTrackersServices", () => {
  it("should call correct URL for getSleepTrackersByDays", async () => {
    const mockDays = 7;
    await sleepTrackersServices.getSleepTrackersByDays(mockDays);

    expect(apiClient.get).toHaveBeenCalledWith(
      `api/sleep/sleepTrackersByDays?days=${mockDays}`
    );
  });

  it("should post correctly for createNewSleepTrackers", async () => {
    const data = { sleepTime: "22:00", wakeTime: "06:00", date: "2025-06-05" };
    await sleepTrackersServices.createNewSleepTrackers(data);

    expect(apiClient.post).toHaveBeenCalledWith(
      `api/sleep/sleepTrackers`,
      data
    );
  });

  it("should call updateSleepTracker with correct params", async () => {
    const id = "abc123";
    const updateData = { duration: 7.5 };
    await sleepTrackersServices.updateSleepTracker(id, updateData);

    expect(apiClient.put).toHaveBeenCalledWith(
      `api/sleep/updateSleepTracker?trackerId=${id}`,
      updateData
    );
  });
});

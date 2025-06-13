
import { sleepTrackersService } from '~/services/sleepTrackersServices'
import { sleepTrackersModel } from '~/models/sleepTrackersModel'
import { ObjectId } from 'mongodb'

jest.mock('~/models/sleepTrackersModel')

describe('sleepTrackersService', () => {
    const mockUserId = new ObjectId('507f191e810c19729de860ea')
    const sampleDate = new Date()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('calculateSleepDuration returns correct duration', () => {
        const sleepTime = new Date('2023-01-01T22:00:00Z')
        const wakeTime = new Date('2023-01-02T06:00:00Z')
        const duration = sleepTrackersService.calculateSleepDuration(sleepTime, wakeTime)
        expect(duration).toBeCloseTo(8)
    })

    test('getSleepTrackersByUserId calls model with correct userId', async () => {
        sleepTrackersModel.findSleepTrackersByUserId.mockResolvedValue([])
        const result = await sleepTrackersService.getSleepTrackersByUserId(mockUserId)
        expect(sleepTrackersModel.findSleepTrackersByUserId).toHaveBeenCalledWith(mockUserId)
        expect(result).toEqual([])
    })

    test('createNew calls model with correct data and calculates duration', async () => {
        const data = {
            userId: mockUserId,
            sleepTime: '2023-01-01T22:00:00Z',
            wakeTime: '2023-01-02T06:00:00Z'
        }
        sleepTrackersModel.createNew.mockResolvedValue({ ...data, duration: 8 })
        const result = await sleepTrackersService.createNew(data)
        expect(sleepTrackersModel.createNew).toHaveBeenCalledWith(expect.objectContaining({
            ...data,
            duration: expect.any(Number)
        }))
        expect(result.duration).toBeCloseTo(8)
    })

    test('updateSleepTraker calls model with updated duration', async () => {
        const trackerId = new ObjectId()
        const data = {
            userId: mockUserId,
            sleepTime: '2023-01-01T22:00:00Z',
            wakeTime: '2023-01-02T06:00:00Z'
        }
        sleepTrackersModel.updateSleepTracker.mockResolvedValue({ ...data, duration: 8 })
        const result = await sleepTrackersService.updateSleepTraker(trackerId, data)
        expect(sleepTrackersModel.updateSleepTracker).toHaveBeenCalledWith(trackerId, expect.objectContaining({
            duration: expect.any(Number)
        }))
        expect(result.duration).toBeCloseTo(8)
    })

    test('getSleepStatsByDays returns aggregated stats', async () => {
        sleepTrackersModel.findSleepTrackers.mockResolvedValue([
            { sleepTime: sampleDate, wakeTime: sampleDate, duration: 7.5 }
        ])

        const result = await sleepTrackersService.getSleepStatsByDays(mockUserId, '7days')

        expect(result).toHaveProperty('sleepTrackers')
        expect(result).toHaveProperty('averageDuration')
        expect(result).toHaveProperty('averageSleepTime')
        expect(result).toHaveProperty('averageWakeTime')
        expect(result).toHaveProperty('countSleepLessThan6Hours')
        expect(result).toHaveProperty('countSleepMoreThan8Hours')
    })
})

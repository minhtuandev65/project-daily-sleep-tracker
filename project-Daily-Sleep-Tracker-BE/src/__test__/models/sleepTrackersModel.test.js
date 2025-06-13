// src/__test__/models/sleepTrackersModel.test.js
import { sleepTrackersModel } from '~/models/sleepTrackersModel'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

jest.mock('~/config/mongodb', () => ({
    GET_DB: jest.fn()
}))

const mockCollection = {
    insertOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    toArray: jest.fn()
}

const mockDB = {
    collection: jest.fn().mockReturnValue(mockCollection)
}

beforeEach(() => {
    jest.clearAllMocks()
    GET_DB.mockReturnValue(mockDB)
})

describe('sleepTrackersModel', () => {
    describe('createNew', () => {
        it('should create a tracker successfully', async () => {
            const mockData = {
                userId: new ObjectId().toString(),
                sleepTime: new Date(),
                wakeTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // +8h
                duration: 8
            }

            const mockInsertResult = { insertedId: 'abc123' }
            mockCollection.insertOne.mockResolvedValue(mockInsertResult)

            const result = await sleepTrackersModel.createNew(mockData)

            expect(mockDB.collection).toHaveBeenCalledWith('sleepTrackers')
            expect(mockCollection.insertOne).toHaveBeenCalled()
            expect(result).toEqual(mockInsertResult)
        })

        it('should throw error if wakeTime <= sleepTime', async () => {
            const badData = {
                userId: new ObjectId().toString(),
                sleepTime: new Date('2024-01-02T06:00:00Z'),
                wakeTime: new Date('2024-01-01T22:00:00Z'),
                duration: 8
            }

            await expect(sleepTrackersModel.createNew(badData)).rejects.toThrow(
                'Thời gian thức dậy phải sau thời gian bắt đầu ngủ.'
            )
        })
    })

    describe('updateSleepTracker', () => {
        it('should update tracker successfully', async () => {
            const trackerId = new ObjectId().toString()
            const data = {
                userId: new ObjectId().toString(),
                sleepTime: new Date('2024-01-01T22:00:00Z'),
                wakeTime: new Date('2024-01-02T06:00:00Z'),
                duration: 8
            }

            const mockResult = { value: { ...data, _id: trackerId } }

            mockCollection.findOneAndUpdate.mockResolvedValue(mockResult)

            const result = await sleepTrackersModel.updateSleepTracker(
                trackerId,
                data
            )

            expect(mockCollection.findOneAndUpdate).toHaveBeenCalled()
            expect(result).toEqual(mockResult)
        })
    })

    describe('findSleepTrackersByUserId', () => {
        it('should return trackers for user', async () => {
            const userId = new ObjectId().toString()
            const trackers = [{ _id: 't1', userId }]

            mockCollection.toArray.mockResolvedValue(trackers)

            const result =
                await sleepTrackersModel.findSleepTrackersByUserId(userId)

            expect(mockCollection.find).toHaveBeenCalledWith({
                userId: new ObjectId(userId)
            })
            expect(result).toEqual(trackers)
        })
    })

    describe('findSleepTrackers', () => {
        it('should return trackers with filter', async () => {
            const userId = new ObjectId().toString()
            const trackers = [{ _id: 't2', userId }]

            mockCollection.toArray.mockResolvedValue(trackers)

            const result = await sleepTrackersModel.findSleepTrackers({
                userId
            })

            expect(mockCollection.find).toHaveBeenCalledWith({
                userId: new ObjectId(userId)
            })
            expect(result).toEqual(trackers)
        })
    })
})

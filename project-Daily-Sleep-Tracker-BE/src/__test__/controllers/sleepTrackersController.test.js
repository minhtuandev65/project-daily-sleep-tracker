import request from 'supertest'
import express from 'express'
import { sleepTrackersController } from '~/controllers/sleepTrackersController'
import { sleepTrackersService } from '~/services/sleepTrackersServices'
import { StatusCodes } from 'http-status-codes'

// Tạo app express để test controller
const app = express()
app.use(express.json())

// Middleware giả lập token payload
app.use((req, res, next) => {
    req.payload = { _id: 'user123' }
    next()
})

app.post('/trackers', sleepTrackersController.createNew)
app.put('/trackers', sleepTrackersController.updateSleepTracker)
app.get('/trackers', sleepTrackersController.getSleepTrackerstByUserId)
app.get('/trackers/days', sleepTrackersController.getSleepTrackersByDays)

// Mock service
jest.mock('~/services/sleepTrackersServices')

describe('sleepTrackersController', () => {
    afterEach(() => jest.clearAllMocks())

    it('createNew - should create a new tracker and return success', async () => {
        sleepTrackersService.createNew.mockResolvedValueOnce()

        const res = await request(app).post('/trackers').send({ duration: 8 })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body).toEqual({
            message: 'success',
            data: { duration: 8 }
        })
        expect(sleepTrackersService.createNew).toHaveBeenCalledWith({
            duration: 8,
            userId: 'user123'
        })
    })

    it('updateSleepTracker - should update a tracker', async () => {
        sleepTrackersService.updateSleepTraker.mockResolvedValueOnce()

        const res = await request(app)
            .put('/trackers')
            .query({ trackerId: 'abc123' })
            .send({ duration: 6 })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body).toEqual({
            message: 'success',
            data: { duration: 6 }
        })
        expect(sleepTrackersService.updateSleepTraker).toHaveBeenCalledWith(
            'abc123',
            { duration: 6, userId: 'user123' }
        )
    })

    it('getSleepTrackerstByUserId - should return trackers for user', async () => {
        const mockData = [{ _id: '1', duration: 7 }]
        sleepTrackersService.getSleepTrackersByUserId.mockResolvedValueOnce(
            mockData
        )

        const res = await request(app).get('/trackers')

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body).toEqual(mockData)
        expect(
            sleepTrackersService.getSleepTrackersByUserId
        ).toHaveBeenCalledWith('user123')
    })

    it('getSleepTrackersByDays - should return stats by days', async () => {
        const mockStats = { average: 7.5 }
        sleepTrackersService.getSleepStatsByDays.mockResolvedValueOnce(
            mockStats
        )

        const res = await request(app).get('/trackers/days').query({ days: 7 })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body).toEqual(mockStats)
        expect(sleepTrackersService.getSleepStatsByDays).toHaveBeenCalledWith(
            'user123',
            '7'
        )
    })
})

import request from 'supertest'
import express from 'express'
import { sleepRoute } from '~/routes/v1/sleepRoute'

// Mock middlewares
jest.mock('~/middlewares/authMiddleware', () => ({
    __esModule: true,
    default: (req, res, next) => next(), // isAuthorized
    hasRole: () => (req, res, next) => next() // hasRole
}))

// Mock controller
jest.mock('~/controllers/sleepTrackersController', () => ({
    sleepTrackersController: {
        createNew: jest.fn((req, res) =>
            res.status(201).json({ message: 'Created sleep tracker' })
        ),
        getSleepTrackerstByUserId: jest.fn((req, res) =>
            res.status(200).json({ message: 'User sleep trackers' })
        ),
        getSleepTrackersByDays: jest.fn((req, res) =>
            res.status(200).json({ message: 'Sleep trackers by days' })
        ),
        updateSleepTracker: jest.fn((req, res) =>
            res.status(200).json({ message: 'Sleep tracker updated' })
        )
    }
}))

const app = express()
app.use(express.json())
app.use('/api', sleepRoute)

describe('sleepTrackersRoute', () => {
    test('POST /api/sleepTrackers - create new sleep tracker', async () => {
        const res = await request(app)
            .post('/api/sleepTrackers')
            .send({ sleepTime: '22:00', wakeTime: '06:00' })

        expect(res.statusCode).toBe(201)
        expect(res.body.message).toBe('Created sleep tracker')
    })

    test('GET /api/ - get sleep trackers by user id', async () => {
        const res = await request(app).get('/api/')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('User sleep trackers')
    })

    test('GET /api/sleepTrackersByDays - get sleep trackers by days', async () => {
        const res = await request(app).get('/api/sleepTrackersByDays')

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Sleep trackers by days')
    })

    test('PUT /api/updateSleepTracker - update sleep tracker', async () => {
        const res = await request(app)
            .put('/api/updateSleepTracker')
            .send({ trackerId: '123', sleepTime: '23:00' })

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Sleep tracker updated')
    })
})

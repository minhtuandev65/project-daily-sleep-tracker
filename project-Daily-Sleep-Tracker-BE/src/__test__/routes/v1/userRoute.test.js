import request from 'supertest'
import express from 'express'
import { userRoute } from '~/routes/v1/userRoute'

// Mock middleware isAuthorized
jest.mock('~/middlewares/authMiddleware', () => ({
    __esModule: true,
    default: (req, res, next) => next()
}))

// Mock controller methods
jest.mock('~/controllers/userController', () => ({
    userController: {
        authenticate: jest.fn((req, res) =>
            res.status(200).json({ message: 'Authenticated' })
        ),
        checkRole: jest.fn((req, res) =>
            res.status(200).json({ role: 'USER' })
        ),
        getMyProfile: jest.fn((req, res) =>
            res.status(200).json({ name: 'John Doe' })
        ),
        createNew: jest.fn((req, res) =>
            res.status(201).json({ message: 'User created' })
        ),
        logout: jest.fn((req, res) =>
            res.status(200).json({ message: 'Logged out' })
        ),
        refreshToken: jest.fn((req, res) =>
            res.status(200).json({ token: 'new-token' })
        ),
        verifyAccount: jest.fn((req, res) =>
            res.status(200).json({ message: 'Email verified' })
        ),
        forgotPassword: jest.fn((req, res) =>
            res.status(200).json({ message: 'Email sent' })
        ),
        resetPassword: jest.fn((req, res) =>
            res.status(200).json({ message: 'Password reset' })
        )
    }
}))

const app = express()
app.use(express.json())
app.use('/api/users', userRoute)

describe('userRoute', () => {
    test('POST /api/users/authenticate - should authenticate user', async () => {
        const res = await request(app)
            .post('/api/users/authenticate')
            .send({ email: 'a@a.com', password: '123' })
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Authenticated')
    })

    test('POST /api/users/checkRole - should return user role', async () => {
        const res = await request(app).post('/api/users/checkRole')
        expect(res.statusCode).toBe(200)
        expect(res.body.role).toBe('USER')
    })

    test('GET /api/users/getMyProfile - should return user profile', async () => {
        const res = await request(app).get('/api/users/getMyProfile')
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('John Doe')
    })

    test('POST /api/users/register - should create user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'new@user.com', password: '123456' })
        expect(res.statusCode).toBe(201)
        expect(res.body.message).toBe('User created')
    })

    test('POST /api/users/logout - should logout user', async () => {
        const res = await request(app).post('/api/users/logout')
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Logged out')
    })

    test('GET /api/users/refresh_token - should refresh token', async () => {
        const res = await request(app).get('/api/users/refresh_token')
        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBe('new-token')
    })

    test('POST /api/users/verifyEmail - should verify email', async () => {
        const res = await request(app)
            .post('/api/users/verifyEmail')
            .send({ token: 'abc' })
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Email verified')
    })

    test('POST /api/users/forgotPassword - should send email for password reset', async () => {
        const res = await request(app)
            .post('/api/users/forgotPassword')
            .send({ email: 'a@a.com' })
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Email sent')
    })

    test('POST /api/users/resetPassword - should reset password', async () => {
        const res = await request(app)
            .post('/api/users/resetPassword')
            .send({ password: 'newpass' })
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Password reset')
    })
})

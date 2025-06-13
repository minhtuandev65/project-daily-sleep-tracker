import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import { userService } from '~/services/userService'

jest.mock('~/services/userService')

// Tạo app express để test controller
const app = express()
app.use(express.json())
app.use(cookieParser())

// Middleware giả lập req.payload
app.use((req, res, next) => {
    req.payload = { _id: 'user123' }
    next()
})

app.post('/users', userController.createNew)
app.post('/users/authenticate', userController.authenticate)
app.post('/users/logout', userController.logout)
app.post('/users/refresh-token', userController.refreshToken)
app.post('/users/verify', userController.verifyAccount)
app.post('/users/forgot-password', userController.forgotPassword)
app.post('/users/reset-password', userController.resetPassword)
app.get('/users/me', userController.getMyProfile)
app.post('/users/check-role', userController.checkRole)

describe('userController', () => {
    afterEach(() => jest.clearAllMocks())

    it('createNew - should create user', async () => {
        userService.createNew.mockResolvedValueOnce({ id: 'abc' })

        const res = await request(app)
            .post('/users')
            .send({ email: 'test@example.com', password: '1234567' })

        expect(res.status).toBe(StatusCodes.CREATED)
        expect(res.body).toEqual({ id: 'abc' })
        expect(userService.createNew).toHaveBeenCalled()
    })

    it('authenticate - should login and set cookies', async () => {
        userService.authenticate.mockResolvedValueOnce({
            _id: 'user123',
            email: 'test@example.com',
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            role: 'BUYER'
        })

        const res = await request(app)
            .post('/users/authenticate')
            .send({ email: 'test@example.com', password: '1234567' })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.headers['set-cookie']).toBeDefined()
        expect(res.body.accessToken).toBe('access-token')
        expect(res.body.refreshToken).toBe('refresh-token')
        expect(res.body.role).toBe('BUYER')
    })

    it('logout - should clear cookies', async () => {
        const res = await request(app).post('/users/logout')

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body).toEqual({ loggedOut: true })
    })

    it('refreshToken - should return new token', async () => {
        userService.refreshToken.mockResolvedValueOnce({
            accessToken: 'new-token'
        })

        const res = await request(app)
            .post('/users/refresh-token')
            .set('Cookie', ['refreshToken=old-refresh'])

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.accessToken).toBe('new-token')
    })

    it('verifyAccount - should verify successfully', async () => {
        userService.verifyAccount.mockResolvedValueOnce({ verified: true })

        const res = await request(app)
            .post('/users/verify')
            .send({ otp: '123456' })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.verified).toBe(true)
    })

    it('forgotPassword - should return reset mail status', async () => {
        userService.forgotPassword.mockResolvedValueOnce({ sent: true })

        const res = await request(app)
            .post('/users/forgot-password')
            .send({ email: 'test@example.com' })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.result.sent).toBe(true)
    })

    it('resetPassword - should reset successfully', async () => {
        userService.resetPassword.mockResolvedValueOnce({ reset: true })

        const res = await request(app)
            .post('/users/reset-password?token=abc123')
            .send({ password: 'newPassword123' })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.reset).toBe(true)
    })

    it('getMyProfile - should return profile', async () => {
        userService.getMyProfile.mockResolvedValueOnce([
            {
                _id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                verifyToken: null,
                isActive: true,
                _destroy: false,
                role: 'BUYER'
            }
        ])

        const res = await request(app).get('/users/me')

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.name).toBe('Test User')
        expect(res.body.email).toBeUndefined()
    })

    it('checkRole - should return user role', async () => {
        userService.checkRole.mockResolvedValueOnce({
            email: 'test@example.com',
            role: 'ADMIN'
        })

        const res = await request(app)
            .post('/users/check-role')
            .send({ email: 'test@example.com' })

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.role).toBe('ADMIN')
    })
})

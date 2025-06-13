import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { StatusCodes } from 'http-status-codes'
import isAuthorized from '~/middlewares/authMiddleware'
import { JwtProvider } from '~/providers/JwtProvider'

jest.mock('~/providers/JwtProvider')

const app = express()
app.use(express.json())
app.use(cookieParser())

// Route dùng middleware
app.get('/protected', isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Authorized' })
})

// ✅ Middleware xử lý lỗi cần dùng đúng format err.status & err.message
app.use((err, req, res, next) => {
    const statusCode =
        err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = err.message || 'Something went wrong'
    res.status(statusCode).json({ message })
})

describe('authMiddleware - isAuthorized', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return 401 if token not found', async () => {
        const res = await request(app).get('/protected')

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
        expect(res.body.message).toBe('Token not found')
    })

    it('should return 410 if token expired', async () => {
        JwtProvider.verifyToken.mockImplementation(() => {
            throw new Error('jwt expired')
        })

        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer expiredtoken')

        expect(res.status).toBe(StatusCodes.GONE)
        expect(res.body.message).toBe('Need to refresh token.')
    })

    it('should return 401 if token invalid', async () => {
        JwtProvider.verifyToken.mockImplementation(() => {
            throw new Error('something else')
        })

        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidtoken')

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED)
        expect(res.body.message).toBe('Unauthorized!')
    })

    it('should pass if token is valid', async () => {
        JwtProvider.verifyToken.mockResolvedValue({
            _id: 'user123',
            role: ['USER']
        })

        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer validtoken')

        expect(res.status).toBe(StatusCodes.OK)
        expect(res.body.message).toBe('Authorized')
    })
})

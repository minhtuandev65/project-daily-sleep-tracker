import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import express from 'express'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

// Giả lập biến môi trường
jest.mock('~/config/environment', () => ({
    env: {
        BUILD_MODE: 'dev'
    }
}))

describe('errorHandlingMiddleware', () => {
    let app

    beforeEach(() => {
        app = express()
        app.get('/error', (req, res, next) => {
            const error = new Error('Test error')
            error.statusCode = StatusCodes.BAD_REQUEST
            next(error)
        })

        app.get('/no-status', (req, res, next) => {
            const error = new Error('No status code')
            next(error)
        })

        app.use(errorHandlingMiddleware)
    })

    it('should return statusCode and message correctly if error has statusCode', async () => {
        const res = await request(app).get('/error')
        expect(res.status).toBe(StatusCodes.BAD_REQUEST)
        expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
        expect(res.body.message).toBe('Test error')
        expect(res.body.stack).toBeDefined()
    })

    it('should default to 500 if statusCode is not provided', async () => {
        const res = await request(app).get('/no-status')
        expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res.body.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(res.body.message).toBe('No status code')
    })

    it('should not include stack if BUILD_MODE !== "dev"', async () => {
        // Mock lại BUILD_MODE = 'prod'
        jest.resetModules()
        jest.doMock('~/config/environment', () => ({
            env: {
                BUILD_MODE: 'prod'
            }
        }))
        const {
            errorHandlingMiddleware: prodMiddleware
        } = require('~/middlewares/errorHandlingMiddleware')

        const prodApp = express()
        prodApp.get('/error', (req, res, next) => {
            const error = new Error('Hidden stack')
            error.statusCode = StatusCodes.BAD_REQUEST
            next(error)
        })
        prodApp.use(prodMiddleware)

        const res = await request(prodApp).get('/error')
        expect(res.status).toBe(StatusCodes.BAD_REQUEST)
        expect(res.body.stack).toBeUndefined()
    })
})

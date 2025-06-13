import { JwtProvider } from '~/providers/JwtProvider'
import JWT from 'jsonwebtoken'

// Giả lập JWT methods
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}))

describe('JwtProvider', () => {
    const userInfo = { _id: 'user123', email: 'test@example.com' }
    const secretKey = 'my-secret'
    const expireTime = '1h'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('generateToken - should return signed JWT token', async () => {
        const mockToken = 'mock.jwt.token'
        JWT.sign.mockReturnValue(mockToken)

        const token = await JwtProvider.generateToken(
            userInfo,
            secretKey,
            expireTime
        )

        expect(JWT.sign).toHaveBeenCalledWith(userInfo, secretKey, {
            algorithm: 'HS256',
            expiresIn: expireTime
        })
        expect(token).toBe(mockToken)
    })

    test('generateToken - should throw error if JWT.sign fails', async () => {
        JWT.sign.mockImplementation(() => {
            throw new Error('sign error')
        })

        await expect(
            JwtProvider.generateToken(userInfo, secretKey, expireTime)
        ).rejects.toThrow('sign error')
    })

    test('verifyToken - should return decoded payload', async () => {
        const decodedPayload = { _id: 'user123', email: 'test@example.com' }
        JWT.verify.mockReturnValue(decodedPayload)

        const result = await JwtProvider.verifyToken('mock.token', secretKey)

        expect(JWT.verify).toHaveBeenCalledWith('mock.token', secretKey)
        expect(result).toEqual(decodedPayload)
    })

    test('verifyToken - should throw error if JWT.verify fails', async () => {
        JWT.verify.mockImplementation(() => {
            throw new Error('verify error')
        })

        await expect(
            JwtProvider.verifyToken('invalid.token', secretKey)
        ).rejects.toThrow('verify error')
    })
})

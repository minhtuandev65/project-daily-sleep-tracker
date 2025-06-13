import { userService } from '~/services/userService'
import { userModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'
import { ResendProvider } from '~/providers/ResendProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'
import ms from 'ms'

// Mock phụ thuộc
jest.mock('~/models/userModel')
jest.mock('~/providers/JwtProvider')
jest.mock('~/providers/ResendProvider')
jest.mock('bcryptjs')
jest.mock('dayjs', () => {
    const actual = jest.requireActual('dayjs')
    return () => actual('2023-01-01T00:00:00Z') // luôn cố định thời gian
})
jest.mock('~/template/createNew', () => jest.fn())
import verifyEmailTemplate from '~/template/createNew'
jest.mock('~/template/forgotPasswordMailTemplate', () => jest.fn())
import forgotPasswordTemplate from '~/template/forgotPasswordMailTemplate'
jest.mock('~/template/resetPasswordSuccessTemplate', () => jest.fn())
import passwordResetSuccessTemplate from '~/template/resetPasswordSuccessTemplate'
describe('userService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('createNew', () => {
        it('should create a new user and send verification email', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
                displayName: 'Test User'
            }

            userModel.findByEmail.mockResolvedValue(null)
            bcrypt.hash.mockResolvedValue('hashed_password')
            userModel.createNew.mockResolvedValue({ insertedId: 'newUserId' })
            userModel.findById.mockResolvedValue({
                _id: 'newUserId',
                email: reqBody.email,
                username: 'test',
                verifyToken: 'verify-token'
            })

            verifyEmailTemplate.mockReturnValue('<html>Email content</html>')

            await userService.createNew(reqBody)

            expect(ResendProvider.sendMail).toHaveBeenCalled()
        })
    })

    describe('authenticate', () => {
        it('should return access and refresh tokens on successful login', async () => {
            const reqBody = {
                email: 'test@example.com',
                password: 'password123',
                role: 'USER'
            }

            userModel.findByEmail.mockResolvedValue({
                _id: '123',
                email: reqBody.email,
                role: ['USER'],
                password: 'hashed',
                isActive: true
            })

            bcrypt.compareSync.mockReturnValue(true)
            JwtProvider.generateToken.mockResolvedValueOnce('access-token')
            JwtProvider.generateToken.mockResolvedValueOnce('refresh-token')

            const result = await userService.authenticate(reqBody)
            expect(result.accessToken).toBe('access-token')
            expect(result.refreshToken).toBe('refresh-token')
        })
    })

    describe('refreshToken', () => {
        it('should generate new access token from refresh token', async () => {
            JwtProvider.verifyToken.mockResolvedValue({
                _id: '123',
                email: 'test@example.com',
                role: 'USER'
            })

            JwtProvider.generateToken.mockResolvedValue('new-access-token')

            const result = await userService.refreshToken('valid-refresh-token')
            expect(result.accessToken).toBe('new-access-token')
        })
    })

    describe('forgotPassword', () => {
        it('should send forgot password email if user exists and is active', async () => {
            const reqBody = { email: 'test@example.com' }

            userModel.findByEmail.mockResolvedValue({
                _id: '123',
                email: reqBody.email,
                isActive: true
            })

            JwtProvider.generateToken.mockResolvedValue('reset-token')

            forgotPasswordTemplate.mockReturnValue('<html>Email content</html>')

            await userService.forgotPassword(reqBody)
            expect(ResendProvider.sendMail).toHaveBeenCalled()
        })
    })

    describe('resetPassword', () => {
        it('should reset password successfully when token is valid and not expired', async () => {
            const token = 'reset-token'
            const newPassword = 'newPassword123'

            JwtProvider.verifyToken.mockResolvedValue({
                _id: '123',
                email: 'test@example.com'
            })

            userModel.findByEmail.mockResolvedValue({
                _id: '123',
                email: 'test@example.com',
                username: 'test',
                isActive: true,
                resetPasswordToken: token,
                resetPasswordExpired: dayjs().add(1, 'hour').toDate()
            })

            bcrypt.hash.mockResolvedValue('hashed_new_pw')
            passwordResetSuccessTemplate.mockReturnValue('<html>Success email</html>')

            const result = await userService.resetPassword({
                token,
                newPassword
            })
            expect(result.email).toBe('test@example.com')
            expect(ResendProvider.sendMail).toHaveBeenCalled()
        })
    })

    describe('checkRole', () => {
        it('should return user role when credentials are valid', async () => {
            const email = 'test@example.com'
            const password = '123456'

            userModel.findByEmail.mockResolvedValue({
                _id: '1',
                email,
                password: 'hashed_password',
                isActive: true,
                role: ['ADMIN']
            })

            bcrypt.compareSync.mockReturnValue(true)

            const result = await userService.checkRole({ email, password })
            expect(result).toEqual({ email, role: ['ADMIN'] })
        })
    })
})

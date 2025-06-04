import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
    // Lấy token từ header Authorization (Bearer token)
    const authHeader = req.headers['authorization']
    const tokenFromHeader = authHeader && authHeader.split(' ')[1]
    // Lấy token từ cookie
    const tokenFromCookie = req.cookies?.accessToken

    // Ưu tiên token từ header nếu có, nếu không thì lấy token từ cookie
    const accessToken = tokenFromHeader || tokenFromCookie
    if (!accessToken) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token not found'))

        return
    }

    try {
        const decodedToken = await JwtProvider.verifyToken(
            accessToken,
            env.ACCESS_TOKEN_SECRET_SIGNATURE
        )

        req.payload = decodedToken

        next()
    } catch (error) {
        if (error?.message?.includes('jwt expired')) {
            next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
            return
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
    }
}

export const hasRole = (role) => {
    return (req, res, next) => {
        const user = req.payload

        if (!user.role?.includes(role)) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .send({ message: 'Not allowed' })
        }

        next()
    }
}
export default isAuthorized

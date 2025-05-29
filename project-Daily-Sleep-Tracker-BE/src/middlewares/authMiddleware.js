import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'


const isAuthorized = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken

  if (!accessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token not found'))

    return
  }

  try {
    const decodedToken = await JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

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

export default isAuthorized
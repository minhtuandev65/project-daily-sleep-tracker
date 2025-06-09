//  dịch vụ cho việc quản lý người dùng
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { APP_LOGO, ROLE, WEBSITE_DOMAIN } from '~/utils/constants'
import { ResendProvider } from '~/providers/ResendProvider'
import dayjs from 'dayjs'
import ms from 'ms'

const createNew = async (reqBody) => {
    const existingUser = await userModel.findByEmail(reqBody.email)

    const requestedRole = reqBody?.role === ROLE.ADMIN ? ROLE.ADMIN : ROLE.USER

    if (existingUser) {
        if (existingUser.role?.includes(requestedRole)) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                'Email already exists with this role.'
            )
        }

        await userModel.pushNewRole(existingUser._id, requestedRole)
        const updatedUser = await userModel.findById(existingUser._id)
        return updatedUser
    }

    const nameFromEmail = reqBody.email.split('@')[0]

    const newUser = {
        email: reqBody.email,
        password: await bcrypt.hash(reqBody.password, 8),
        username: nameFromEmail,
        displayName: reqBody.displayName,
        verifyToken: uuidv4(),
        role: [requestedRole]
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
        'Daily Sleep Tracker system: Please verify your email before using our services!'
    const htmlContent = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h2 {
            color: #333333;
          }
          p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #999999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to Daily Sleep Tracker!</h2>
          <p>Hi ${getNewUser.username},</p>
          <p>Thank you for creating an account with us. Please confirm your email address by clicking the button below:</p>

          <a href="${verificationLink}" class="button">Verify Your Email</a>

          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;"><a href="${verificationLink}">Verification link</a></p>

          <div class="footer">
            <p>If you didn’t create this account, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
  `

    await ResendProvider.sendMail(getNewUser.email, customSubject, htmlContent)
    return getNewUser
}
const authenticate = async (reqBody) => {
    try {
        const existUser = await userModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (!existUser.role?.includes(reqBody.role.toUpperCase()))
            throw new ApiError(
                StatusCodes.CONFLICT,
                'Ensure to login right account'
            )

        if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your email or password is incorrect!'
            )
        }

        const role = (
            existUser.role?.find((r) => r === reqBody.role.toUpperCase()) ||
            'BUYER'
        ).toUpperCase()

        const userInfo = {
            _id: existUser._id,
            email: existUser.email,
            role
        }

        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        )
        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE
        )
        await userModel.updateLatestActive(existUser._id)
        return { ...userInfo, accessToken, refreshToken }
    } catch (error) {
        throw Error(error)
    }
}
const refreshToken = async (clientRefreshToken) => {
    try {
        // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
        const refreshTokenDecoded = await JwtProvider.verifyToken(
            clientRefreshToken,
            env.REFRESH_TOKEN_SECRET_SIGNATURE
        )
        // Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.

        const userInfo = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email,
            role: refreshTokenDecoded.role
        }

        // Buoc 02, Tao ra accessToken moi
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            // 5 giay
            env.ACCESS_TOKEN_LIFE
        )
        await userModel.updateLatestActive(refreshTokenDecoded._id)
        return {
            accessToken
        }
    } catch (error) {
        throw Error(error)
    }
}

const verifyAccount = async (reqBody) => {
    try {
        const existUser = await userModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (reqBody.token !== existUser.verifyToken) {
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token invalid')
        }
        const updatedData = {
            isActive: true,
            verifyToken: null
        }

        const updatedUser = await userModel.update(existUser._id, updatedData)

        return updatedUser
    } catch (error) {
        throw Error(error)
    }
}
const activateUser = async (userId) => {
    try {
        const existUser = await userModel.findById(userId)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        const updatedData = { isActive: true }
        let updatedUser = await userModel.update(existUser._id, updatedData)
        return updatedUser
    } catch (error) {
        throw Error(error)
    }
}
const forgotPassword = async (reqBody) => {
    try {
        const existUser = await userModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        const userInfo = {
            _id: existUser._id,
            email: existUser.email
        }

        const token = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.FORGOT_PASSWORD_TOKEN_LIFE
        )

        const confirmationLink = `${WEBSITE_DOMAIN}/account/resetPassword?token=${token}`

        await userModel.update(existUser._id, {
            resetPasswordToken: token,
            resetPasswordExpired: dayjs()
                .add(ms(env.FORGOT_PASSWORD_TOKEN_LIFE) + 10000, 'millisecond')
                .toDate()
        })

        const forgotPasswordMailTemplate = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Forgot Password</title>
      </head>
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">

         <!-- Header -->
  <table width="100%" bgcolor="#000000" style="margin:0; padding:0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="${APP_LOGO}" alt="Logo" style="width: 100%; display:block;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table width="600" bgcolor="#ffffff" cellpadding="30" cellspacing="0" style="margin: 20px auto; border-radius: 8px;">
                <tr>
                  <td>
                    <h2 style="color:#333;">Reset Your Password</h2>
                    <p style="color:#555; font-size:16px;">We received a request to reset your password. Click the button below to set a new one.</p>
                    <p style="text-align:center; margin: 30px 0;">
                      <a href="${confirmationLink}" style="background-color:#000000; color:#ffffff; padding: 12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Reset Password</a>
                    </p>
                    <p style="color:#888; font-size:14px;">If you didn’t request a password reset, you can safely ignore this email.</p>
                    <p style="color:#888; font-size:14px;">This link will expire in ${env.FORGOT_PASSWORD_TOKEN_LIFE} minutes.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="20">
          <tr>
            <td align="center" style="font-size:12px; color:#aaa;">
              &copy; ${dayjs().year()} Daily Sleep Tracker. All rights reserved.
            </td>
          </tr>
        </table>

      </body>
      </html>
      `
        await ResendProvider.sendMail(
            existUser.email,
            'Forgot password confirmation email',
            forgotPasswordMailTemplate
        )
        return true
    } catch (error) {
        throw Error(error)
    }
}

const resetPassword = async (reqBody) => {
    try {
        const { token, newPassword } = reqBody

        const resetPasswordTokenDecoded = await JwtProvider.verifyToken(
            token,
            env.ACCESS_TOKEN_SECRET_SIGNATURE
        )

        const email = resetPasswordTokenDecoded.email
        const _id = resetPasswordTokenDecoded._id

        const userInfo = {
            _id,
            email
        }

        const existUser = await userModel.findByEmail(email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (
            existUser.resetPasswordToken !== token ||
            dayjs().isAfter(existUser.resetPasswordExpired)
        )
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Invalid token or reset password request expired'
            )

        const updatedUser = {
            password: await bcrypt.hash(newPassword, 8),
            resetPasswordToken: null,
            resetPasswordExpired: null
        }

        const resetPasswordSuccessTemplate = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset Successful</title>
      </head>
      <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">

        <!-- Header -->
  <table width="100%" bgcolor="#000000" style="margin:0; padding:0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="${APP_LOGO}" alt="Logo" style="width: 100%; display:block;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table width="600" bgcolor="#ffffff" cellpadding="30" cellspacing="0" style="margin: 20px auto; border-radius: 8px;">
                <tr>
                  <td>
                    <h2 style="color:#333;">Your Password Has Been Changed</h2>
                    <p style="color:#555; font-size:16px;">Hi ${existUser.username},</p>
                    <p style="color:#555; font-size:16px;">We’re just letting you know that your password was successfully reset. If this was you, there’s nothing more to do.</p>
                    <p style="color:#555; font-size:16px;">If you did not perform this action, please contact our support immediately to secure your account.</p>
                    <p style="margin-top: 30px;">
                      <a href="${WEBSITE_DOMAIN}/login" style="background-color:#000000; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">Log In</a>
                    </p>
                    <p style="color:#888; font-size:14px;">Thanks,<br/>The Daily Sleep Tracker Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="20">
          <tr>
            <td align="center" style="font-size:12px; color:#aaa;">
              &copy; ${dayjs().year()} Daily Sleep Tracker. All rights reserved.
            </td>
          </tr>
        </table>

      </body>
      </html>
      `

        await userModel.update(existUser._id, updatedUser)

        await ResendProvider.sendMail(
            existUser.email,
            'Reset password success notification email',
            resetPasswordSuccessTemplate
        )

        return { ...userInfo }
    } catch (error) {
        throw Error(error)
    }
}
const getMyProfile = async (userId) => {
    try {
        const user = await userModel.getMyProfile(userId)

        return user
    } catch (error) {
        throw Error(error)
    }
}
const checkRole = async ({ email, password }) => {
    const existUser = await userModel.findByEmail(email)
    if (!existUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (!existUser.isActive) {
        throw new ApiError(
            StatusCodes.NOT_ACCEPTABLE,
            'Your account is not active!'
        )
    }
    // So sánh mật khẩu
    const ok = bcrypt.compareSync(password, existUser.password)
    if (!ok) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Email or password is incorrect!'
        )
    }
    // Chỉ trả về role (và email để frontend dễ quản lý)
    return { email: existUser.email, role: existUser.role }
}
export const userService = {
    createNew,
    authenticate,
    refreshToken,
    verifyAccount,
    activateUser,
    forgotPassword,
    resetPassword,
    getMyProfile,
    checkRole
}

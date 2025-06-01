// route cho việc quản lý người dùng

import express from 'express'
import { userController } from '~/controllers/userController'
import isAuthorized from '~/middlewares/authMiddleware'

const Router = express.Router()

// Router xác thực dăng nhập của người dùng
Router.route('/authenticate').post(userController.authenticate)
//
Router.route('/checkRole').post(userController.checkRole)
Router.route('/getMyProfile').get(isAuthorized, userController.getMyProfile)
// Router dang ký tài khoản mới
Router.route('/register').post(userController.createNew)

// Router cho việc đăng xuất người dùng
Router.route('/logout').post(userController.logout)

Router.route('/refresh_token').get(userController.refreshToken)

Router.route('/verifyEmail').post(userController.verifyAccount)

Router.route('/forgotPassword').post(userController.forgotPassword)

Router.route('/resetPassword').post(userController.resetPassword)

export const userRoute = Router

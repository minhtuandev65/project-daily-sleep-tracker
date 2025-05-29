// route cho việc quản lý người dùng

import express from 'express'
import { userController } from '~/controllers/userController'


const Router = express.Router()

// Router xác thực dăng nhập của người dùng
Router.route('/authenticate').post(userController.authenticate)

// Router dang ký tài khoản mới
Router.route('/register').post(userController.createNew)

// Router cho việc đăng xuất người dùng
Router.route('/logout').post(userController.logout)

Router.route('/refresh_token').get(userController.refreshToken)

Router.route('/verify').post(userController.verifyAccount)

Router.route('/forgot_password').post(userController.forgotPassword)

Router.route('/reset_password').post(userController.resetPassword)

export const userRoute = Router

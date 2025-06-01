// route cho việc quản lý giấc ngủ
// routes/sleepRecordsRoute.js
// route cho việc quản lý người dùng

import express from 'express'
import { sleepRecordsController } from '~/controllers/sleepRecordsController'
import isAuthorized, { hasRole } from '~/middlewares/authMiddleware'
import { ROLE } from '~/utils/constants'

const Router = express.Router()

// Router tạo mới bản ghi giấc ngủ
Router.route('/sleepRecords').post(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.createNew
)

// Router lấy bản ghi giấc ngủ theo id
Router.route('/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getSleepRecordstByUserId
)
Router.route('/sleepRecordsByDays/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getSleepRecordsByDays
) // Lấy tất cả bản ghi giấc ngủ theo ngày 7dyas or 30days
// Router tính trung bình thời gian ngủ và thức dậy
Router.route('/averageSleepAndWake/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getAverageSleepAndWakeTime
)
// Router tính số ngày ngủ ít hơn 6 tiếng
Router.route('/countSleepLessThan6Hours/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.countDaysWithSleepLessThan6Hours
)
// Router tính số ngày ngủ nhiều hơn 8 tiếng
Router.route('/countSleepMoreThan8Hours/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.countDaysWithSleepMoreThan8Hours
)
// Router tính trung bình thời gian ngủ trong tuần
Router.route('/weeklyAverage/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getAverageSleepDurationByDays
)

export const sleepRoute = Router

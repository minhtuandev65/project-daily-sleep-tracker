// route cho việc quản lý giấc ngủ

// route cho việc quản lý người dùng

import express from 'express'
import { sleepRecordsController } from '~/controllers/sleepRecordsController'
import isAuthorized, { hasRole } from '~/middlewares/authMiddleware'
import { ROLE } from '~/utils/constants'

const Router = express.Router()

// Router tạo mới bản ghi giấc ngủ
Router.route('/sleepRecords')
    .post(isAuthorized, hasRole(ROLE.USER), sleepRecordsController.createNew)
    .get(
        isAuthorized,
        hasRole(ROLE.USER),
        sleepRecordsController.getSleepRecordsByRange
    ) // Lấy tất cả bản ghi giấc ngủ theo ngày 7dyas or 30days

Router.route('/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getSleepRecordstByUserId
)

Router.route('/averageSleepAndWake/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getAverageSleepAndWakeTimeController
)
Router.route('/countSleepLessThan6Hours/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.countDaysWithSleepLessThan6Hours
)
Router.route('/countSleepMoreThan8Hours/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.countDaysWithSleepMoreThan8Hours
)
// routes/sleepRecordsRoute.js
Router.route('/weeklyAverage/:userId').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepRecordsController.getWeeklyAverageSleep
)

export const sleepRoute = Router

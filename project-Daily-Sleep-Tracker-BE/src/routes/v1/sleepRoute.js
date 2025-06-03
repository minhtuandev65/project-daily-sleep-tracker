// route cho việc quản lý giấc ngủ
// routes/sleepTrackersRoute.js
// route cho việc quản lý người dùng

import express from 'express'
import { sleepTrackersController } from '~/controllers/sleepTrackersController'
import isAuthorized, { hasRole } from '~/middlewares/authMiddleware'
import { ROLE } from '~/utils/constants'

const Router = express.Router()

// Router tạo mới bản ghi giấc ngủ
Router.route('/sleepTrackers').post(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.createNew
)

// Router lấy bản ghi giấc ngủ theo id
Router.route('/').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.getSleepTrackerstByUserId
)
Router.route('/sleepTrackersByDays').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.getSleepTrackersByDays
) // Lấy tất cả bản ghi giấc ngủ theo ngày 7dyas or 30days
// Router tính trung bình thời gian ngủ và thức dậy
Router.route('/averageSleepAndWake').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.getAverageSleepAndWakeTime
)
// Router tính số ngày ngủ ít hơn 6 tiếng
Router.route('/countSleepLessThan6Hours').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.countDaysWithSleepLessThan6Hours
)
// Router tính số ngày ngủ nhiều hơn 8 tiếng
Router.route('/countSleepMoreThan8Hours').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.countDaysWithSleepMoreThan8Hours
)
// Router tính trung bình thời gian ngủ trong tuần
Router.route('/weeklyAverage').get(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.getAverageSleepDurationByDays
)
Router.route('/updateSleepTracker').put(
    isAuthorized,
    hasRole(ROLE.USER),
    sleepTrackersController.updateSleepTracker
)
export const sleepRoute = Router

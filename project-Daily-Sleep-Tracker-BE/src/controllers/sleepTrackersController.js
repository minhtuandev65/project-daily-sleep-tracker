// SleepTrackersController.js
import { sleepTrackersService } from '~/services/sleepTrackersServices'
import { StatusCodes } from 'http-status-codes'
const createNew = async (req, res, next) => {
    try {
        const userId = req.payload._id
        const data = {
            ...req.body,
            userId
        }
        const result = await sleepTrackersService.createNew(data)
        res.status(StatusCodes.OK).json({
            message: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const updateSleepTracker = async (req, res, next) => {
    try {
        const trackerId = req.query.trackerId
        const userId = req.payload._id
        const data = {
            ...req.body,
            userId
        }
        const result = await sleepTrackersService.updateSleepTraker(
            trackerId,
            data
        )
        res.status(StatusCodes.OK).json({
            message: 'Cập nhật bản ghi giấc ngủ thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const getSleepTrackerstByUserId = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const result =
            await sleepTrackersService.getSleepTrackersByUserId(userId)
        res.status(200).json({
            message: 'Lấy dữ liệu giấc ngủ thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const getAverageSleepAndWakeTime = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const { days } = req.query
        const result = await sleepTrackersService.getAverageSleepAndWakeTime(
            userId,
            days
        )
        res.status(200).json({
            message: 'Lấy trung bình giờ đi ngủ và giờ thức dậy thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const getAverageSleepDurationByDays = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const { days } = req.query
        const result = await sleepTrackersService.getAverageSleepDurationByDays(
            userId,
            days
        )
        res.status(200).json({
            message: 'Lấy thời gian ngủ trung bình theo tuần thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const countDaysWithSleepLessThan6Hours = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const { days } = req.query
        const result =
            await sleepTrackersService.countDaysWithSleepLessThan6Hours(
                userId,
                days
            )
        res.status(200).json({
            message: 'Đếm số ngày ngủ ít hơn 6 tiếng thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const countDaysWithSleepMoreThan8Hours = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const { days } = req.query
        const result =
            await sleepTrackersService.countDaysWithSleepMoreThan8Hours(
                userId,
                days
            )
        res.status(200).json({
            message: 'Đếm số ngày ngủ nhiều hơn 8 tiếng thành công',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const getSleepTrackersByDays = async (req, res, next) => {
    try {
        const userId = req.payload._id
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const { days } = req.query
        const data = await sleepTrackersService.getSleepTrackersByDays(
            userId,
            days
        )

        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export const sleepTrackersController = {
    createNew,
    getSleepTrackerstByUserId,
    getSleepTrackersByDays,
    countDaysWithSleepLessThan6Hours,
    countDaysWithSleepMoreThan8Hours,
    getAverageSleepAndWakeTime,
    getAverageSleepDurationByDays,
    updateSleepTracker
}

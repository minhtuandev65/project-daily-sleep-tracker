// SleepRecordController.js
import { sleepRecordsService } from '~/services/sleepRecordsServices'
import { StatusCodes } from 'http-status-codes'
const createNew = async (req, res, next) => {
    try {
        const result = await sleepRecordsService.createNew(req.body)
        res.status(StatusCodes.OK).json({
            message: 'success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const getSleepRecordstByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const result = await sleepRecordsService.getSleepRecordsByUserId(userId)
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
        const userId = req.params.userId
        const { days } = req.query
        const result = await sleepRecordsService.getAverageSleepAndWakeTime(
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
        const userId = req.params.userId
        const { days } = req.query
        const result = await sleepRecordsService.getAverageSleepDurationByDays(
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
        const userId = req.params.userId
        const { days } = req.query
        const result =
            await sleepRecordsService.countDaysWithSleepLessThan6Hours(
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
        const userId = req.params.userId
        const { days } = req.query
        const result =
            await sleepRecordsService.countDaysWithSleepMoreThan8Hours(
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
const getSleepRecordsByDays = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user._id
        const { days } = req.query
        const data = await sleepRecordsService.getSleepRecordsByDays(
            userId,
            days
        )

        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export const sleepRecordsController = {
    createNew,
    getSleepRecordstByUserId,
    getSleepRecordsByDays,
    countDaysWithSleepLessThan6Hours,
    countDaysWithSleepMoreThan8Hours,
    getAverageSleepAndWakeTime,
    getAverageSleepDurationByDays
}

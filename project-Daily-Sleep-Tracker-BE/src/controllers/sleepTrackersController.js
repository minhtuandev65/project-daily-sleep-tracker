//src/controllers/sleepTrackersController.js
import { sleepTrackersService } from '~/services/sleepTrackersServices'
import { StatusCodes } from 'http-status-codes'
const createNew = async (req, res, next) => {
    try {
        const userId = req.payload._id
        const data = {
            ...req.body,
            userId
        }
        await sleepTrackersService.createNew(data)
        res.status(StatusCodes.OK).json({
            message: 'success',
            data: req.body
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
        await sleepTrackersService.updateSleepTraker(trackerId, data)
        res.status(StatusCodes.OK).json({
            message: 'success',
            data: req.body
        })
    } catch (error) {
        next(error)
    }
}
const getSleepTrackerstByUserId = async (req, res, next) => {
    try {
        const userId = req.payload._id
        const data = await sleepTrackersService.getSleepTrackersByUserId(userId)
        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        next(error)
    }
}
const getSleepTrackersByDays = async (req, res, next) => {
    try {
        const userId = req.payload._id
        const { days } = req.query
        const data = await sleepTrackersService.getSleepStatsByDays(
            userId,
            days
        )

        res.status(StatusCodes.OK).json(data)
    } catch (error) {
        next(error)
    }
}

export const sleepTrackersController = {
    createNew,
    getSleepTrackerstByUserId,
    getSleepTrackersByDays,
    updateSleepTracker
}

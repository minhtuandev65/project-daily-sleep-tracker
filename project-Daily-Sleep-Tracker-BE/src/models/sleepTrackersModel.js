// sleepTrackersModel.js
import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE } from '~/validations/validators'
import { ObjectId } from 'mongodb'

export const SLEEPTRACKERS_COLLECTION_NAME = 'sleepTrackers'
const SLEEPTRACKERS_COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .required()
        .label('ID người dùng'),

    sleepTime: Joi.date().required().label('Thời gian bắt đầu ngủ'),

    wakeTime: Joi.date()
        .greater(Joi.ref('sleepTime'))
        .required()
        .label('Thời gian thức dậy'),
    duration: Joi.number()
        .positive()
        .precision(2)
        .required()
        .label('Số giờ ngủ'),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) => {
    return await SLEEPTRACKERS_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}

const createNew = async (data) => {
    try {
        const { sleepTime, wakeTime } = data
        const sleepTimeDate = new Date(sleepTime)
        const wakeTimeDate = new Date(wakeTime)
        if (isNaN(sleepTimeDate) || isNaN(wakeTimeDate)) {
            throw new Error('Dữ liệu thời gian không hợp lệ.')
        }
        if (wakeTimeDate <= sleepTimeDate) {
            throw new Error(
                'Thời gian thức dậy phải sau thời gian bắt đầu ngủ.'
            )
        }
        const validData = await validateBeforeCreate({
            ...data,
            userId: data.userId
        })
        validData.userId = new ObjectId(validData.userId)
        const result = await GET_DB()
            .collection(SLEEPTRACKERS_COLLECTION_NAME)
            .insertOne(validData)
        return result
    } catch (error) {
        console.error('Lỗi khi tạo sleep tracker:', error)
        throw new Error(error.message)
    }
}
const updateSleepTracker = async (trackerId, data) => {
    try {
        const { sleepTime, wakeTime } = data
        const sleepTimeDate = new Date(sleepTime)
        const wakeTimeDate = new Date(wakeTime)
        if (isNaN(sleepTimeDate) || isNaN(wakeTimeDate)) {
            throw new Error('Dữ liệu thời gian không hợp lệ.')
        }
        if (wakeTimeDate <= sleepTimeDate) {
            throw new Error(
                'Thời gian thức dậy phải sau thời gian bắt đầu ngủ.'
            )
        }
        const validData = await validateBeforeCreate({
            ...data,
            userId: data.userId
        })
        validData.userId = new ObjectId(validData.userId)
        validData.updatedAt = new Date()
        const update = await GET_DB()
            .collection(SLEEPTRACKERS_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(trackerId) },
                { $set: validData },
                { returnDocument: 'after' }
            )
        return update
    } catch (error) {
        console.error('Lỗi khi cập nhật sleep tracker:', error)
        throw new Error(error)
    }
}
const findSleepTrackersByUserId = async (userId) => {
    try {
        const result = await GET_DB()
            .collection(SLEEPTRACKERS_COLLECTION_NAME)
            .find({ userId: new ObjectId(userId) }) // Dùng ObjectId thay vì string
            .sort({ sleepTime: -1 })
            .toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}
const findSleepTrackers = async (filter) => {
    try {
        if (filter.userId && typeof filter.userId === 'string') {
            filter.userId = new ObjectId(filter.userId)
        }
        const result = await GET_DB()
            .collection(SLEEPTRACKERS_COLLECTION_NAME)
            .find(filter)
            .sort({ sleepTime: -1 })
            .toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const sleepTrackersModel = {
    createNew,
    findSleepTrackersByUserId,
    findSleepTrackers,
    updateSleepTracker
}

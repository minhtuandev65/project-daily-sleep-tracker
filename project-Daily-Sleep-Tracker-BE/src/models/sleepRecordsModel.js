// sleepRecordsModel.js
import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE } from '~/validations/validators'
import { ObjectId } from 'mongodb'
export const SLEEPRECORDS_COLLECTION_NAME = 'sleepRecords'

const SLEEPRECORDS_COLLECTION_SCHEMA = Joi.object({
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
    return await SLEEPRECORDS_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        validData.userId = new ObjectId(validData.userId)
        const result = await GET_DB()
            .collection(SLEEPRECORDS_COLLECTION_NAME)
            .insertOne(validData)
        return result
    } catch (error) {
        throw new Error(error.message)
    }
}
const findSleepRecordsByUserId = async (userId) => {
    try {
        const result = await GET_DB()
            .collection(SLEEPRECORDS_COLLECTION_NAME)
            .find({ userId: new ObjectId(userId) }) // Dùng ObjectId thay vì string
            .sort({ sleepTime: -1 })
            .toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}
const findSleepRecords = async (filter) => {
    try {
        if (filter.userId && typeof filter.userId === 'string') {
            filter.userId = new ObjectId(filter.userId)
        }

        console.log('Filter:', filter)
        const result = await GET_DB()
            .collection(SLEEPRECORDS_COLLECTION_NAME)
            .find(filter)
            .sort({ sleepTime: -1 })
            .toArray()
        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const sleepRecordsModel = {
    createNew,
    findSleepRecordsByUserId,
    findSleepRecords
}

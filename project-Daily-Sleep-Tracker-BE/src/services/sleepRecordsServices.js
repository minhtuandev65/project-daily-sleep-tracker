// sleepRecordsServices.js
import { ObjectId } from 'mongodb'
import { sleepRecordsModel } from '~/models/sleepRecordsModel'

const calculateSleepDuration = (sleepTime, wakeTime) => {
    const sleep = new Date(sleepTime)
    const wake = new Date(wakeTime)
    const durationMs = wake - sleep
    const durationHours = durationMs / (1000 * 60 * 60)
    return parseFloat(durationHours.toFixed(2))
}
const getDaysFromRange = (range) => {
    const map = {
        '7days': 7,
        '30days': 30
    }
    return map[range] || 7 // default là 7 ngày nếu không khớp
}

// Đếm số ngày ngủ ít hơn 6 tiếng
const countDaysWithSleepLessThan6Hours = async (userId, range) => {
    const days = getDaysFromRange(range)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const start = new Date()
    start.setDate(today.getDate() - (days - 1))
    start.setHours(0, 0, 0, 0)

    const records = await sleepRecordsModel.findSleepRecords({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        sleepTime: { $gte: start, $lte: today },
        duration: { $lte: 6 }
    })

    return records.length
}

// Đếm số ngày ngủ nhiều hơn 8 tiếng
const countDaysWithSleepMoreThan8Hours = async (userId, range) => {
    const days = getDaysFromRange(range)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const start = new Date()
    start.setDate(today.getDate() - (days - 1))
    start.setHours(0, 0, 0, 0)

    const records = await sleepRecordsModel.findSleepRecords({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        sleepTime: {
            $gte: start,
            $lte: today
        },
        duration: { $gte: 8 }
    })

    return records.length
}

const getAverageSleepAndWakeTime = async (userId, range) => {
    const days = getDaysFromRange(range)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const start = new Date()
    start.setDate(today.getDate() - (days - 1))
    start.setHours(0, 0, 0, 0)

    const records = await sleepRecordsModel.findSleepRecords({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        sleepTime: {
            $gte: start,
            $lte: today
        }
    })

    if (records.length === 0)
        return {
            averageSleepTime: null,
            averageWakeTime: null
        }

    let totalSleepHours = 0
    let totalWakeHours = 0

    for (const record of records) {
        const sleepDate = new Date(record.sleepTime)
        const wakeDate = new Date(record.wakeTime)

        const sleepHour = sleepDate.getHours() + sleepDate.getMinutes() / 60
        const wakeHour = wakeDate.getHours() + wakeDate.getMinutes() / 60

        totalSleepHours += sleepHour
        totalWakeHours += wakeHour
    }

    const avgSleepHour = parseFloat(
        (totalSleepHours / records.length).toFixed(2)
    )
    const avgWakeHour = parseFloat((totalWakeHours / records.length).toFixed(2))

    return {
        averageSleepTime: avgSleepHour,
        averageWakeTime: avgWakeHour
    }
}

const getAverageSleepDurationByDays = async (userId, range) => {
    const days = getDaysFromRange(range)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const start = new Date()
    start.setDate(today.getDate() - (days - 1))
    start.setHours(0, 0, 0, 0)

    const records = await sleepRecordsModel.findSleepRecords({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        sleepTime: {
            $gte: start,
            $lte: today
        }
    })

    const validDurations = records
        .map((r) => r.duration)
        .filter((d) => typeof d === 'number' && !isNaN(d))

    if (validDurations.length === 0) return null

    const total = validDurations.reduce((sum, d) => sum + d, 0)
    const average = parseFloat((total / validDurations.length).toFixed(2))

    return average
}

const createNew = async (data) => {
    const { userId, sleepTime, wakeTime } = data
    const duration = calculateSleepDuration(sleepTime, wakeTime)

    const newRecord = {
        userId,
        sleepTime,
        wakeTime,
        duration
    }

    const result = await sleepRecordsModel.createNew(newRecord)
    return result
}

const getSleepRecordsByUserId = async (userId) => {
    return await sleepRecordsModel.findSleepRecordsByUserId(userId)
}

const getSleepRecordsByDays = async (userId, days) => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const getPastDate = (days) => {
        const date = new Date()
        date.setDate(date.getDate() - days)
        date.setHours(0, 0, 0, 0)
        return date
    }

    const rangeConfig = {
        '7days': () => [getPastDate(7), today],
        '30days': () => [getPastDate(30), today]
    }

    if (!rangeConfig[days]) throw new Error('Invalid range type')

    const [startDate, endDate] = rangeConfig[days]()

    const data = await sleepRecordsModel.findSleepRecords({
        userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
        sleepTime: {
            $gte: startDate,
            $lte: endDate
        }
    })

    return data
}

export const sleepRecordsService = {
    createNew,
    calculateSleepDuration,
    getSleepRecordsByUserId,
    getSleepRecordsByDays,
    countDaysWithSleepLessThan6Hours,
    countDaysWithSleepMoreThan8Hours,
    getAverageSleepAndWakeTime,
    getAverageSleepDurationByDays
}

// sleepRecordsServices.js
import { sleepRecordsModel } from '~/models/sleepRecordsModel'

const calculateSleepDuration = (sleepTime, wakeTime) => {
    const sleep = new Date(sleepTime)
    const wake = new Date(wakeTime)
    const durationMs = wake - sleep
    const durationHours = durationMs / (1000 * 60 * 60)
    return parseFloat(durationHours.toFixed(2))
}
// Đếm số ngày ngủ ít hơn 6 tiếng
const countDaysWithSleepLessThan6Hours = async (userId) => {
    return await sleepRecordsModel.findSleepRecords({
        userId,
        duration: { $lte: 6 }
    })
}

// Đếm số ngày ngủ nhiều hơn 8 tiếng
const countDaysWithSleepMoreThan8Hours = async (userId) => {
    return await sleepRecordsModel.findSleepRecords({
        userId,
        duration: { $gte: 8 }
    })
}
const getAverageSleepAndWakeTime = async (userId) => {
    const records = await sleepRecordsModel.findSleepRecords({ userId })

    if (records.length === 0)
        return { dateStart: null, dateEnd: null, averageSleepTime: null, averageWakeTime: null }

    let totalSleepHours = 0
    let totalWakeHours = 0

    let minDate = new Date(records[0].date)
    let maxDate = new Date(records[0].date)

    for (const record of records) {
        const sleepDate = new Date(record.sleepTime)
        const wakeDate = new Date(record.wakeTime)

        const sleepHour = sleepDate.getHours() + sleepDate.getMinutes() / 60
        const wakeHour = wakeDate.getHours() + wakeDate.getMinutes() / 60

        totalSleepHours += sleepHour
        totalWakeHours += wakeHour

        const currentDate = new Date(record.date)
        if (currentDate < minDate) minDate = currentDate
        if (currentDate > maxDate) maxDate = currentDate
    }

    const avgSleepHour = parseFloat((totalSleepHours / records.length).toFixed(2))
    const avgWakeHour = parseFloat((totalWakeHours / records.length).toFixed(2))

    return {
        dateStart: minDate.toISOString().split('T')[0],
        dateEnd: maxDate.toISOString().split('T')[0],
        averageSleepTime: avgSleepHour,
        averageWakeTime: avgWakeHour
    }
}

const getWeekInfo = (dateData) => {
    const date = new Date(dateData)
    date.setHours(0, 0, 0, 0)

    const day = date.getDay()
    const diffToMonday = (day === 0 ? -6 : 1) - day
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() + diffToMonday)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const daysDiff = Math.floor((startOfWeek - firstDayOfYear) / (1000 * 60 * 60 * 24))
    const week = Math.ceil((daysDiff + 1) / 7)

    return {
        year: date.getFullYear(),
        week,
        startOfWeek: startOfWeek.toISOString().split('T')[0],
        endOfWeek: endOfWeek.toISOString().split('T')[0]
    }
}
const getWeeklyAverageSleep = async (userId) => {
    const records = await sleepRecordsModel.findSleepRecords({ userId })

    if (records.length === 0) return []

    const weekMap = {}

    for (const record of records) {
        const weekInfo = getWeekInfo(record.date)

        const duration = record.duration || calculateSleepDuration(record.sleepTime, record.wakeTime)

        const key = `${weekInfo.year}-W${weekInfo.week}`

        if (!weekMap[key]) {
            weekMap[key] = {
                weekStart: weekInfo.startOfWeek,
                weekEnd: weekInfo.endOfWeek,
                totalSleep: 0,
                count: 0
            }
        }

        weekMap[key].totalSleep += duration
        weekMap[key].count += 1
    }

    return Object.entries(weekMap).map(([weekKey, data]) => ({
        week: weekKey,
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        averageSleepDuration: parseFloat((data.totalSleep / data.count).toFixed(2))
    }))
}

const createNew = async (data) => {
    const { userId, sleepTime, wakeTime, date } = data
    const duration = calculateSleepDuration(sleepTime, wakeTime)

    const newRecord = {
        userId,
        sleepTime,
        wakeTime,
        date,
        duration
    }

    const result = await sleepRecordsModel.createNew(newRecord)
    return result
}

const getSleepRecordsByUserId = async (userId) => {
    return await sleepRecordsModel.findSleepRecordsByUserId(userId)
}

const getPastDate = (daysAgo) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return new Date(date.getTime() - daysAgo * 24 * 60 * 60 * 1000)
}
const getSleepRecordsByRange = async (userId, range, from, to) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const rangeConfig = {
        '7days': () => [getPastDate(7), today],
        '30days': () => [getPastDate(30), today],
        custom: () => {
            if (!from || !to)
                throw new Error('Missing from/to for custom range')
            return [new Date(from), new Date(to)]
        }
    }

    if (!rangeConfig[range]) throw new Error('Invalid range type')

    let [startDate, endDate] = rangeConfig[range]()
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    const records = await sleepRecordsModel
        .find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        })
        .sort({ date: -1 })

    return records
}
export const sleepRecordsService = {
    createNew,
    calculateSleepDuration,
    getSleepRecordsByUserId,
    getSleepRecordsByRange,
    countDaysWithSleepLessThan6Hours,
    countDaysWithSleepMoreThan8Hours,
    getAverageSleepAndWakeTime,
    getWeeklyAverageSleep
}

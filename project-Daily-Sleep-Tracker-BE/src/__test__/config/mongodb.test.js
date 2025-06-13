import { MongoMemoryServer } from 'mongodb-memory-server'
import * as dbModule from '../../config/mongodb'

let mongoServer
let uri

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    uri = mongoServer.getUri()

    process.env.MONGODB_URI = uri
    process.env.DATABASE_NAME = 'testdb'

    jest.resetModules()
    jest.mock('../../config/environment', () => ({
        env: {
            MONGODB_URI: process.env.MONGODB_URI,
            DATABASE_NAME: process.env.DATABASE_NAME
        }
    }))
})

afterAll(async () => {
    await dbModule.CLOSE_DB()
    await mongoServer.stop()
})

describe('MongoDB Connection Module', () => {
    it('should connect to DB and create text index', async () => {
        await dbModule.CONNECT_DB()
        const db = dbModule.GET_DB()

        expect(db).toBeDefined()

        const indexes = await db.collection('sleepTrackers').indexes()
        const textIndex = indexes.find(
            (idx) => idx.name === 'TextIndexForSearch'
        )

        expect(textIndex).toBeDefined()
        expect(textIndex.weights).toMatchObject({
            title: 1,
            description: 1,
            location: 1
        })
    })

    it('should throw error if DB is not connected and GET_DB is called', async () => {
        // Reset cache module
        jest.resetModules()

        // Re-mock lại environment
        jest.mock('../../config/environment', () => ({
            env: {
                MONGODB_URI: process.env.MONGODB_URI,
                DATABASE_NAME: process.env.DATABASE_NAME
            }
        }))

        // isolateModules để tạo module mới không dính cache
        await jest.isolateModulesAsync(async () => {
            const dbModuleFresh = await import('../../config/mongodb')

            // không gọi CONNECT_DB => jobSeekDatabaseInstance = null
            expect(() => dbModuleFresh.GET_DB()).toThrow(
                'Must connect to mongodb first.'
            )
        })
    })
})

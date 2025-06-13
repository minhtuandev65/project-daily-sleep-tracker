// __tests__/userModel.test.js

import { userModel } from '~/models/userModel'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

jest.mock('~/config/mongodb', () => ({
    GET_DB: jest.fn()
}))

const mockCollection = {
    insertOne: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    aggregate: jest.fn()
}

const mockDb = {
    collection: jest.fn(() => mockCollection)
}

beforeEach(() => {
    jest.clearAllMocks()
    GET_DB.mockReturnValue(mockDb)
})

describe('userModel', () => {
    const mockUser = {
        email: 'test@example.com',
        password: '123456',
        username: 'test',
        displayName: 'Test User'
    }

    test('createNew - should insert valid user', async () => {
        mockCollection.insertOne.mockResolvedValue({ insertedId: 'abc123' })

        const result = await userModel.createNew(mockUser)

        expect(mockCollection.insertOne).toHaveBeenCalled()
        expect(result).toEqual({ insertedId: 'abc123' })
    })

    test('findByEmail - should find user by email', async () => {
        const foundUser = { email: 'test@example.com' }
        mockCollection.findOne.mockResolvedValue(foundUser)

        const result = await userModel.findByEmail('test@example.com')

        expect(mockCollection.findOne).toHaveBeenCalledWith({
            email: 'test@example.com'
        })
        expect(result).toEqual(foundUser)
    })

    test('findById - should find user by id and exclude password', async () => {
        const foundUser = { _id: new ObjectId(), email: 'test@example.com' }
        mockCollection.findOne.mockResolvedValue(foundUser)

        const result = await userModel.findById(foundUser._id.toString())

        expect(mockCollection.findOne).toHaveBeenCalledWith(
            { _id: new ObjectId(foundUser._id.toString()) },
            { projection: { password: 0 } }
        )
        expect(result).toEqual(foundUser)
    })

    test('pushNewRole - should add new role to user', async () => {
        const userId = new ObjectId().toString()
        mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 })

        const result = await userModel.pushNewRole(userId, 'ADMIN')

        expect(mockCollection.updateOne).toHaveBeenCalledWith(
            { _id: new ObjectId(userId) },
            { $addToSet: { role: 'ADMIN' } }
        )
        expect(result.modifiedCount).toBe(1)
    })

    test('getMyProfile - should return user without password', async () => {
        const userId = new ObjectId().toString()
        const foundUser = [
            { _id: new ObjectId(userId), email: 'test@example.com' }
        ]
        mockCollection.aggregate.mockReturnValue({
            toArray: () => Promise.resolve(foundUser)
        })

        const result = await userModel.getMyProfile(userId)

        expect(mockCollection.aggregate).toHaveBeenCalled()
        expect(result).toEqual(foundUser)
    })

    test('update - should update valid fields', async () => {
        const userId = new ObjectId().toString()
        const updateFields = {
            displayName: 'Updated Name',
            _id: 'shouldBeIgnored'
        }
        const mockUpdated = {
            value: { _id: userId, displayName: 'Updated Name' }
        }

        mockCollection.findOneAndUpdate.mockResolvedValue(mockUpdated)

        const result = await userModel.update(userId, updateFields)

        expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: new ObjectId(userId) },
            expect.objectContaining({
                $set: expect.objectContaining({ displayName: 'Updated Name' })
            }),
            { returnDocument: 'after' }
        )
        expect(result).toEqual(mockUpdated)
    })

    test('updateLatestActive - should update latestActiveAt field', async () => {
        const userId = new ObjectId().toString()
        const updatedResult = { value: { _id: userId } }
        mockCollection.findOneAndUpdate.mockResolvedValue(updatedResult)

        const result = await userModel.updateLatestActive(userId)

        expect(mockCollection.findOneAndUpdate).toHaveBeenCalled()
        expect(result).toEqual(updatedResult)
    })
})

import { corsOptions } from '~/config/cors' // đường dẫn đến file chứa `corsOptions`

jest.mock('~/config/environment', () => ({
    env: { BUILD_MODE: 'dev' }
}))

jest.mock('~/utils/constants', () => ({
    WEBSITE_DOMAIN: ['https://myapp.com', 'https://another.com']
}))

describe('CORS Options', () => {
    it('should allow all origins in dev mode', () => {
        const callback = jest.fn()

        corsOptions.origin('http://random.local', callback)

        expect(callback).toHaveBeenCalledWith(null, true)
    })

    it('should allow origin if in WEBSITE_DOMAIN during production mode', async () => {
        // reset lại module để đổi env
        jest.resetModules()
        jest.doMock('~/config/environment', () => ({
            env: { BUILD_MODE: 'production' }
        }))

        const { corsOptions: corsProd } = await import('~/config/cors')
        const callback = jest.fn()
        corsProd.origin('https://myapp.com', callback)

        expect(callback).toHaveBeenCalledWith(null, true)
    })

    it('should reject origin not in WEBSITE_DOMAIN during production mode', async () => {
        // reset lại module để đổi env
        jest.resetModules()
        jest.doMock('~/config/environment', () => ({
            env: { BUILD_MODE: 'production' }
        }))

        const { corsOptions: corsProd } = await import('~/config/cors')

        const callback = jest.fn()

        corsProd.origin('http://malicious.com', callback)

        expect(callback.mock.calls[0][0]).toBeInstanceOf(Error)
        expect(callback.mock.calls[0][0].message).toMatch(
            /http:\/\/malicious\.com not allowed/
        )
    })
})

// ⚠️ Mock trước khi import ResendProvider
jest.mock('resend', () => {
    return {
        Resend: jest.fn()
    }
})

import { ResendProvider, setResendInstance } from '~/providers/ResendProvider'

describe('ResendProvider', () => {
    const recipient = 'test@example.com'
    const subject = 'Welcome!'
    const htmlContent = '<h1>Hello!</h1>'

    let mockSend

    beforeEach(() => {
        jest.clearAllMocks()
        mockSend = jest.fn()

        // Gán instance mock vào provider
        const mockResendInstance = {
            emails: {
                send: mockSend
            }
        }
        setResendInstance(mockResendInstance)
    })

    test('sendMail - should send email with correct parameters', async () => {
        const mockResult = { id: 'mock-email-id' }
        mockSend.mockResolvedValue(mockResult)

        const consoleLogSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {})

        await ResendProvider.sendMail(recipient, subject, htmlContent)

        expect(mockSend).toHaveBeenCalledWith({
            from: 'noreply@reniwdev.uk',
            to: recipient,
            subject,
            html: htmlContent
        })

        expect(consoleLogSpy).toHaveBeenCalledWith('Resend result:', mockResult)
        consoleLogSpy.mockRestore()
    })

    test('sendMail - should log error if sending fails', async () => {
        const error = new Error('Send failed')
        mockSend.mockRejectedValue(error)

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        await ResendProvider.sendMail(recipient, subject, htmlContent)

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error sending email:',
            error
        )
        consoleErrorSpy.mockRestore()
    })
})

import { MessagesError } from 'errors/types/MessagesError'

describe('MessagesError', () => {
  it('Should return correctly type error and message error', () => {
    const errorMessage = 'custom error'
    const messagesError = new MessagesError(errorMessage)
    const error = () => {
      throw new MessagesError(errorMessage)
    }
    expect(messagesError.toString()).toBe(errorMessage)
    expect(error).toThrow(MessagesError)
  })
})

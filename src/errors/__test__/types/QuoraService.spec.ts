import { QuoraServiceError } from 'errors/types/QuoraServiceError'

describe('QuoraServiceError', () => {
  it('Should return correctly type error and message error', () => {
    const errorMessage = 'custom error'
    const authError = new QuoraServiceError(errorMessage)
    const error = () => {
      throw new QuoraServiceError(errorMessage)
    }
    expect(authError.toString()).toBe(errorMessage)
    expect(error).toThrow(QuoraServiceError)
  })
})

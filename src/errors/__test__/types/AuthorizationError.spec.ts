import { AuthorizationError } from 'errors/types/AuthorizationError'

describe('AuthorizationError', () => {
  it('Should return correctly type error and message error', () => {
    const errorMessage = 'custom error'
    const authError = new AuthorizationError(errorMessage)
    const error = () => {
      throw new AuthorizationError(errorMessage)
    }
    expect(authError.toString()).toBe(errorMessage)
    expect(error).toThrow(AuthorizationError)
  })
})

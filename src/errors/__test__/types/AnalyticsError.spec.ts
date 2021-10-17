import { AnalyticsError } from 'errors/types/AnalyticsError'

describe('AnalyticsError',()=>{
  it('Should return correctly type error and message error',()=>{
    const errorMessage = 'custom error'
    const analyticsError = new AnalyticsError(errorMessage);
    const error = () => {
      throw new AnalyticsError(errorMessage)
    };
    expect(analyticsError.toString()).toBe(errorMessage)
    expect(error).toThrow(AnalyticsError)
  })
})

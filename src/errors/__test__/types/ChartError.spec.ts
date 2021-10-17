import { ChartError } from 'errors/types/ChartError'

describe('AuthorizationError',()=>{
  it('Should return correctly type error and message error',()=>{
    const errorMessage = 'custom error'
    const chartError = new ChartError(errorMessage);
    const error = () => {
      throw new ChartError(errorMessage)
    };
    expect(chartError.toString()).toBe(errorMessage)
    expect(error).toThrow(ChartError)
  })
})

import { LighthouseError } from 'errors/types/LighthouseError'

describe('LighthouseError',()=>{
  it('Should return correctly type error and message error',()=>{
    const errorMessage = 'custom error'
    const lighthouseError = new LighthouseError(errorMessage);
    const error = () => {
      throw new LighthouseError(errorMessage)
    };
    expect(lighthouseError.toString()).toBe(errorMessage)
    expect(error).toThrow(LighthouseError)
  })
})

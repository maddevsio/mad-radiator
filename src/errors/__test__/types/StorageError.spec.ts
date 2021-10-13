import { StorageError } from 'errors/types/StorageError'

describe('StorageError',()=>{
  it('Should return correctly type error and message error',()=>{
    const errorMessage = 'custom error'
    const storageError = new StorageError(errorMessage);
    const error = () => {
      throw new StorageError('custom error')
    };
    expect(storageError.toString()).toBe(errorMessage)
    expect(error).toThrow(StorageError)
  })
})

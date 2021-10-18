import { StorageError } from 'errors/types/StorageError'
import { google } from 'googleapis'
import { GoogleDriveStorage } from 'storage/GoogleDriveStorage'


// @ts-ignore
jest.spyOn(google, 'drive').mockImplementation(() => ({
  files: {
    create: jest.fn(async () => ({
      data: {
        id: 123,
      },
    })),
  },
  permissions: {
    create: jest.fn(),
  },
}))

describe('GoogleDriveStorage', () => {
  it('should correctly create an instance', () => {
    const storage = new GoogleDriveStorage()
    expect(storage.storeFile).toBeTruthy()
  })

  it('should correctly return link after called storeFile', async () => {
    const storage = new GoogleDriveStorage()
    const link = await storage.storeFile(Buffer.from('123'))

    expect(link).toBe('https://drive.google.com/uc?export=view&id=123')
  })

  it('should correctly return undefined instead of link after called storeFile', async () => {
    // @ts-ignore
    jest.spyOn(google, 'drive').mockImplementation(() => ({
      files: {
        create: jest.fn(async () => ({
          data: {
            id: undefined,
          },
        })),
      },
      permissions: {
        create: jest.fn(),
      },
    }))

    const storage = new GoogleDriveStorage()
    const link = await storage.storeFile(Buffer.from('123'))

    expect(link).toBeUndefined()
  })
  it('should correctly throw AnalyticsError', async () => {

    // @ts-ignore
    jest.spyOn(google, 'drive').mockImplementation(() => Promise.reject(new Error('api error')))

    const storage = new GoogleDriveStorage()
    await expect(storage.storeFile(Buffer.from('123'))).rejects.toThrow(StorageError)
  })
})

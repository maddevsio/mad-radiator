import { google } from 'googleapis'
import { StorageService } from 'services/Storage.service'

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

describe('StorageService', () => {
  it('should correctly create an instance', () => {
    const service = new StorageService()

    expect(service.storeFile).toBeTruthy()
  })

  it('should correctly return link after called storeFile', async () => {
    const service = new StorageService()
    const link = await service.storeFile(Buffer.from('123'))

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

    const service = new StorageService()
    const link = await service.storeFile(Buffer.from('123'))

    expect(link).toBeUndefined()
  })
})

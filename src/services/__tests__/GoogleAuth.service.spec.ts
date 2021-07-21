import fs from 'fs'

import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { RadiatorConfig } from 'interfaces'
import { GoogleAuthService } from 'services/GoogleAuth.service'
import { LoggerService } from 'services/Logger.service'

jest.spyOn(LoggerService, 'error').mockImplementation(() => {})

jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    options: jest.fn(),
  },
}))

jest.spyOn(fs, 'writeFile').mockImplementation(
  () =>
    new Promise<void>(res => {
      res()
    }),
)
jest.spyOn(fs, 'unlink').mockImplementation(
  () =>
    new Promise<void>(res => {
      res()
    }),
)

describe('GoogleAuthService', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly create an instance', () => {
    const service = new GoogleAuthService(config)

    expect(service.authorize).toBeTruthy()
  })

  it('should correctly authorize', async () => {
    const service = new GoogleAuthService(config)

    const { unlink } = await service.authorize()

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.unlink).toHaveBeenCalledTimes(0)

    await unlink()

    expect(fs.unlink).toHaveBeenCalledTimes(1)
  })

  it('should errors correctly handle with logger service', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation(
      (_, __, cb) =>
        new Promise<void>(res => {
          cb(new Error('error'))
          res()
        }),
    )
    jest.spyOn(fs, 'unlink').mockImplementation(
      (_, cb) =>
        new Promise<void>(res => {
          cb(new Error('error'))
          res()
        }),
    )

    const service = new GoogleAuthService(config)
    const { unlink } = await service.authorize()

    expect(LoggerService.error).toHaveBeenCalledTimes(1)

    await unlink()

    expect(LoggerService.error).toHaveBeenCalledTimes(2)
  })
})

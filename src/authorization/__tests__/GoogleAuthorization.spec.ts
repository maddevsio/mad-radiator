import fs from 'fs'

import { GoogleAuthorization } from 'authorization/GoogleAuthorization'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { EnvironmentConfig } from 'interfaces'
import { Logger } from 'logger'

import { defaultGoogleAuthorizationParams } from '../../__tests__/fixtures/defaultGoogleAuthorizationParams'

jest.spyOn(Logger, 'error').mockImplementation(() => { })

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

describe('GoogleAuthorization', () => {
  let config: EnvironmentConfig

  beforeEach(() => {
    config = defaultGoogleAuthorizationParams
  })

  it('should correctly create an instance', () => {
    const service = new GoogleAuthorization(config)

    expect(service.authorize).toBeTruthy()
  })

  it('should correctly authorize', async () => {
    const service = new GoogleAuthorization(config)

    const { unlink } = await service.authorize()

    expect(fs.unlink).toHaveBeenCalledTimes(0)

    await unlink()

    expect(fs.unlink).toHaveBeenCalledTimes(1)
  })

  it('should correctly throw AuthorizationError', async () => {
    const error = () => {
      throw new AuthorizationError('authorization error')
    }
    expect(error).toThrow(AuthorizationError)
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

    const service = new GoogleAuthorization(config)
    const { unlink } = await service.authorize()

    await unlink()

    expect(Logger.error).toHaveBeenCalledTimes(1)
  })
})

import fs from 'fs'

import { GoogleAuthorization } from 'authorization/GoogleAuthorization'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { EnvironmentConfig } from 'interfaces'
import { Logger } from 'logger'

import { defaultGoogleAuthorizationParams } from '../../__tests__/fixtures/defaultGoogleAuthorizationParams'

jest.spyOn(Logger, 'error').mockImplementation(() => {})

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

  it('should correctly throw AuthorizationError', async () => {
    const error = () => {
      throw new AuthorizationError('authorization error')
    }
    expect(error).toThrow(AuthorizationError)
  })
})

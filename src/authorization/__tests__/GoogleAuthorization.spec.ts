import { defaultGoogleAuthorizationParams } from '__tests__/fixtures/defaultGoogleAuthorizationParams'
import { GoogleAuthorizationWithTokens } from 'authorization/GoogleAuthorizationWithTokens'
import { EnvironmentConfig } from 'interfaces'


jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(),
      GoogleAuth: jest.fn(),
    },
    options: jest.fn(),
  },
}))

describe('GoogleAuthorization', () => {
  let config: EnvironmentConfig

  beforeEach(() => {
    config = defaultGoogleAuthorizationParams
  })

  it('should correctly create an instance', () => {
    const service = new GoogleAuthorizationWithTokens(config)

    expect(service.authorize).toBeTruthy()
  })
})

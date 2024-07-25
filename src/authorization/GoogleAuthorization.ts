import { AuthorizationError } from 'errors/types/AuthorizationError'
import { google } from 'googleapis'
import { EnvironmentConfig } from 'interfaces'

export class GoogleAuthorization {
  private readonly config: EnvironmentConfig

  constructor(config: EnvironmentConfig) {
    this.config = config
  }

  public async authorize() {
    try {
      const auth = new google.auth.JWT(
        this.config.analyticsClientEmail,
        undefined,
        this.config.analyticsPrivateKey.replace(/\\n/g, '\n'),
        [
          'https://www.googleapis.com/auth/analytics',
          'https://www.googleapis.com/auth/drive',
        ]
      )

      await auth.authorize()
      google.options({ auth })

      return {
        google,
      }
    } catch (error: any) {
      throw new AuthorizationError(error)
    }
  }
}

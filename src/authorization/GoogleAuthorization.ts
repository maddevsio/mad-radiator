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
      const { clientId, clientSecret, redirectUri, accessToken, refreshToken } = this.config

      const { OAuth2 } = google.auth;
      const oauth2Client = new OAuth2( clientId, clientSecret, redirectUri);

      oauth2Client.setCredentials({
        access_token:accessToken,
        refresh_token:refreshToken
      })

      google.options({ auth:oauth2Client })
      return {
        google,
      }
    } catch (error) {
      throw new AuthorizationError(error)
    }
  }
}

import { AuthorizationError } from 'errors/types/AuthorizationError'
import { google } from 'googleapis'
import { EnvironmentConfig } from 'interfaces'


export class GoogleAuthorizationWithTokens {
  private readonly config: EnvironmentConfig

  constructor(config: EnvironmentConfig) {
    this.config = config
  }

  public async authorize() {
    try {
      const {
        clientId,
        clientSecret,
        redirectUri,
        accessToken,
        refreshToken,
        expiryDate,
        tokenType,
        idToken
      } = this.config

      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate,
        token_type: tokenType,
        id_token: idToken,
      })

      google.options({ auth: oauth2Client })

      return {
        google,
      }
    } catch (error: any) {
      console.log('Error', error);
      
      throw new AuthorizationError(error)
    }
  }
}

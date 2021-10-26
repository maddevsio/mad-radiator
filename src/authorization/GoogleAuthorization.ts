import fs from 'fs'
import path from 'path'

import { AuthorizationError } from 'errors/types/AuthorizationError'
import { google } from 'googleapis'
import { EnvironmentConfig } from 'interfaces'
import { Logger } from 'logger'

/**
 * Path to keys.json file
 */
const KEYS_FILEPATH = path.join(__dirname, 'keys.json')

export class GoogleAuthorization {
  private readonly config: any

  constructor(config: any) {
    this.config = config
  }

  public async authorize() {
    try {
      await this.buildKeysFile(this.config)

      const auth = new google.auth.GoogleAuth({
        keyFilename: KEYS_FILEPATH,
        scopes: [
          'https://www.googleapis.com/auth/analytics',
          'https://www.googleapis.com/auth/drive',
        ],
      })

      google.options({ auth })
      return {
        unlink: async () => {
          fs.unlink(KEYS_FILEPATH, error => error && Logger.error(`Unlink error: ${error}`))
        },
        google,
      }
    } catch (error) {
      throw new AuthorizationError(error)
    }
  }

  private async buildKeysFile(config: EnvironmentConfig) {
    const fileData = `{
    "type": "${config.authType}",
    "project_id": "${config.analyticsProjectId}",
    "private_key_id": "${config.analyticsPrivateKeyId}",
    "private_key": "${config.analyticsPrivateKey}",
    "client_email": "${config.analyticsClientEmail}",
    "client_id": "${config.analyticsClientId}",
    "auth_uri": "${config.analyticsAuthUrl}",
    "token_uri": "${config.analyticsTokenUri}",
    "auth_provider_x509_cert_url": "${config.analyticsProviderCertUrl}",
    "client_x509_cert_url": "${config.analyticsClientCertUrl}"
  }`

    await fs.writeFile(
      KEYS_FILEPATH,
      fileData,
      error => error && Logger.error(`Write file error: ${error}`),
    )
  }
}

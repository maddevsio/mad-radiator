import { unlink } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import { AuthorizationError } from 'errors/types/AuthorizationError'
import { google } from 'googleapis'
import { EnvironmentConfig } from 'interfaces'
import { Logger } from 'logger'

export class GoogleAuthorization {
  private readonly config: EnvironmentConfig

  private KEYS_FILEPATH: string

  constructor(config: EnvironmentConfig) {
    this.config = config
    this.KEYS_FILEPATH = path.join(__dirname, 'keys.json')
  }

  public async authorize() {
    try {
      await this.buildKeysFile(this.config, this.KEYS_FILEPATH)
      const auth = new google.auth.GoogleAuth({
        keyFilename: this.KEYS_FILEPATH,
        scopes: [
          'https://www.googleapis.com/auth/analytics',
          'https://www.googleapis.com/auth/drive',
        ],
      })

      google.options({ auth })

      return {
        unlink: async () => {
          await unlink(this.KEYS_FILEPATH, error => error && Logger.error(`Unlink error: ${error}`))
        },
        google,
      }
    } catch (error: any) {
      throw new AuthorizationError(error)
    }
  }

  private async buildKeysFile(config: EnvironmentConfig, keysFilePath: string) {
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

    try {
      await writeFile(keysFilePath, fileData)
      return true
    } catch (error: any) {
      throw new AuthorizationError(error)
    }
  }
}

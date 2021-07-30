import fs from 'fs'
import path from 'path'

import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'
import { Logger } from 'logger'

/**
 * Path to keys.json file
 */
const KEYS_FILEPATH = path.join(__dirname, 'keys.json')

export class GoogleAuthorization {
  private readonly config: RadiatorConfig

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  public async authorize() {
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
  }

  private async buildKeysFile(config: RadiatorConfig) {
    const fileData = `{
    "type": "${config.env.authType}",
    "project_id": "${config.env.analyticsProjectId}",
    "private_key_id": "${config.env.analyticsPrivateKeyId}",
    "private_key": "${config.env.analyticsPrivateKey}",
    "client_email": "${config.env.analyticsClientEmail}",
    "client_id": "${config.env.analyticsClientId}",
    "auth_uri": "${config.env.analyticsAuthUrl}",
    "token_uri": "${config.env.analyticsTokenUri}",
    "auth_provider_x509_cert_url": "${config.env.analyticsProviderCertUrl}",
    "client_x509_cert_url": "${config.env.analyticsClientCertUrl}"
  }`

    await fs.writeFile(
      KEYS_FILEPATH,
      fileData,
      error => error && Logger.error(`Write file error: ${error}`),
    )
  }
}

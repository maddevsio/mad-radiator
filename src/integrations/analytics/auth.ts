/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

/**
 * Path to keys.json file
 */
const KEYS_FILEPATH = path.join(__dirname, 'keys.json')

/**
 * Function for build keys file for google auth
 */
async function buildKeysFile(config: RadiatorConfig) {
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

  await fs.writeFile(KEYS_FILEPATH, fileData, error => console.error(error))
}

/**
 * Function for unlink(delete) keys file
 */
async function unlinkKeysFile() {
  await fs.unlink(KEYS_FILEPATH, error => console.error(error))
}

/**
 * Function for authorize in google
 */
export async function authorize(config: RadiatorConfig): Promise<typeof unlinkKeysFile> {
  await buildKeysFile(config)

  const auth = new google.auth.GoogleAuth({
    keyFilename: KEYS_FILEPATH,
    scopes: ['https://www.googleapis.com/auth/analytics'],
  })

  google.options({ auth })

  return unlinkKeysFile
}

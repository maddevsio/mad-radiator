import { writeFileSync } from 'fs'
import path from 'path'

import dotenv from 'dotenv'
import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { FirestoreConfig } from 'interfaces'
import { Moment } from 'moment'

import { AuthorizationError } from '../errors/types/AuthorizationError'

// eslint-disable-next-line jest/require-hook
dotenv.config()

export class Firestore {
  private readonly KEYS_FILEPATH: string

  private readonly config: FirestoreConfig

  private db: admin.firestore.Firestore | undefined

  constructor(firestoreConfig: FirestoreConfig) {
    this.KEYS_FILEPATH = path.join(__dirname, 'serviceAccount.json')
    this.config = firestoreConfig
    this.authorize()
  }

  private authorize() {
    try {
      this.buildKeysFile(this.config, this.KEYS_FILEPATH)
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(this.KEYS_FILEPATH),
        })
      }
      this.db = getFirestore()
    } catch (e: any) {
      throw new AuthorizationError(e)
    }
  }

  private buildKeysFile(config: FirestoreConfig, keysFilePath: string) {
    const fileData = `{
            "type": "${config.authType}",
            "project_id": "${config.firestoreProjectId}",
            "private_key_id": "${config.firestorePrivateKeyId}",
            "private_key": "${config.firestorePrivateKey}",
            "client_email": "${config.firestoreClientEmail}",
            "client_id": "${config.firestoreClientId}",
            "auth_uri": "${config.firestoreAuthUri}",
            "token_uri": "${config.firestoreTokenUri}",
            "auth_provider_x509_cert_url": "${config.firestoreAuthProviderCertUrl}",
            "client_x509_cert_url": "${config.firestoreClientCertUrl}"
        }`

    try {
      writeFileSync(keysFilePath, fileData)
      return true
    } catch (error: any) {
      throw new AuthorizationError(error)
    }
  }

  public async setData(documentName: string, fields: object) {
    return this.db?.collection(documentName).add(fields)
  }

  public async getDataAfterDate(date: Moment, dir: string, limit?: number) {
    let count: number = 0
    const data = await this.db
      ?.collection(dir)
      .where('created', '>=', date)
      .limit(limit || 1)
      .get()
    data?.forEach(doc => {
      count = doc.data().count
    })
    return count
  }
}

import dotenv from 'dotenv'
import admin, { ServiceAccount } from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { FirestoreConfig } from 'interfaces'
import { Moment } from 'moment'

import { AuthorizationError } from '../errors/types/AuthorizationError'

// eslint-disable-next-line jest/require-hook
dotenv.config()

export class Firestore {
  private readonly config: FirestoreConfig

  private db: admin.firestore.Firestore | undefined

  constructor(firestoreConfig: FirestoreConfig) {
    this.config = firestoreConfig
    this.authorize()
  }

  private authorize() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(this.buildKeysFile(this.config)
          ),
        })
      }
      this.db = getFirestore()
    } catch (e: any) {
      throw new AuthorizationError(e)
    }
  }

  private buildKeysFile(config: FirestoreConfig): ServiceAccount {
    return {
      // @ts-ignore
      type: config.authType,
      project_id: config.firestoreProjectId,
      private_key_id: config.firestorePrivateKeyId,
      private_key: JSON.stringify(config.firestorePrivateKey.replace(/\\n/gm, "\n")),
      client_email: config.firestoreClientEmail,
      client_id: config.firestoreClientId,
      auth_uri: config.firestoreAuthUri,
      token_uri: config.firestoreTokenUri,
      auth_provider_x509_cert_url: config.firestoreAuthProviderCertUrl,
      client_x509_cert_url: config.firestoreClientCertUrl,
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

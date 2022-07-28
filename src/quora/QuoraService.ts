import axios from 'axios';
import { QuoraServiceError } from 'errors/types/QuoraServiceError';
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'

import { QuoraParams } from './interfaces'

export class QuoraService {
  private firestore: Firestore

  // private readonly query = 'window.ansFrontendGlobals.data.inlineQueryResults.results';

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  private currentCount: number

  private quoraUserID?: string

  constructor(quoraParams: QuoraParams, firestoreConfig: FirestoreConfig) {
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.quoraUserID = quoraParams.quoraUserID
  }

  private async parseHTML(): Promise<number> {
    try {
      const { data } = await axios.get(`${this.url}${this.quoraUserID}`)
      const posts = data.match(/(?<=postsCount\\":)\d+/gim)
      return Number(posts[0])
    } catch (error: any) {
      throw new QuoraServiceError(`Cannot get Quora posts count: ${error.message}`)
    }
  }

  private async getQuoraPostsMetrics(): Promise<number> {
    const oldCount = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), this.fireStoreDir, 1)
    const currentCount = this.currentCount - oldCount
    return currentCount < 0 ? 0 : currentCount
  }

  public async setCountOfQuoraPosts(): Promise<any> {
    try {
      const posts = await this.parseHTML()
      this.currentCount = posts
      await this.firestore.setData(this.fireStoreDir, {
        count: posts,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      })
      return await this.getQuoraPostsMetrics()
    } catch (error: any) {
      return new QuoraServiceError(error.message)
    }
  }
}

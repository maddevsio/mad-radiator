import axios from 'axios'
import { QuoraServiceError } from 'errors/types/QuoraServiceError'
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'
import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'

import { QuoraParams } from './interfaces'

export class QuoraService implements RadiatorService {
  private firestore: Firestore

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  private currentCount: number

  private readonly quoraUserID?: string

  constructor(quoraParams: QuoraParams, firestoreConfig: FirestoreConfig) {
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.quoraUserID = quoraParams.quoraUserID
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

  public getName(): string {
    return this.constructor.name
  }

  async perform(results: BuildMessageDataSpec, _radiator: RadiatorSpec): Promise<BuildMessageDataSpec> {
    return Object.assign(
      results,
      {
          quoraPosts: await executeWithRetry(
            `${this.getName()}.setCountOfQuoraPosts()`, 5, 1500,
            () => this.setCountOfQuoraPosts(),
            (error: any) => error),
        },
    )
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
}

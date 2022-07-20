import admin from 'firebase-admin'
import got from 'got'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'


import { QuoraParams } from './interfaces'

export class QuoraService {
  private firestore: Firestore

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  private currentCount: number

  // TODO: fix undefined type
  private quoraUserID?: string

  constructor(quoraParams: QuoraParams, firestoreConfig: FirestoreConfig) {
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.quoraUserID = quoraParams.quoraUserID
  }

  private async getHTML(): Promise<string> {
    const { body } = await got(`${this.url}${this.quoraUserID}`)
    return body
  }

  private async parseHTML(): Promise<number> {
    const re = /(?<=postsCount\\":)\d+/g
    const body: string = await this.getHTML()
    const parsedString: Array<string> | null = body.match(re)

    return parsedString !== null ? Number(parsedString[0]) : 0
  }

  private async getQuoraPostsMetrics(): Promise<number> {
    const oldCount = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), this.fireStoreDir, 1)
    const currentCount = this.currentCount - oldCount
    return currentCount < 0 ? 0 : currentCount
  }

  public async setCountOfQuoraPosts(): Promise<any> {
    try {
      const posts = await this.parseHTML()
      this.currentCount = Number(posts)
      await this.firestore.setData(this.fireStoreDir, {
        count: posts,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      })
      return await this.getQuoraPostsMetrics()
    } catch (error: any) {
      return new Error(error)
    }
  }
}

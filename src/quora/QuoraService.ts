import dotenv from 'dotenv';
import got from 'got';
import moment from 'moment';
import { Firestore } from 'utils/firestore'

import { QuoraParams } from './interfaces';


// eslint-disable-next-line jest/require-hook
dotenv.config();

export class QuoraService {
  private firestore: Firestore

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  private currentCount: number

  // TODO: fix undefined type
  private quoraUserID?: string

  constructor(quoraParams: QuoraParams) {
    this.firestore = new Firestore()
    this.currentCount = 0
    this.quoraUserID = quoraParams.quoraUserID
  }

  private async getHTML(): Promise<string> {
    const { body } = await got(`${this.url}${this.quoraUserID}`)
    return body
  }

  private async parseHTML(): Promise<number> {
    const re = /(?<=postsCount\\":)\d+/g;
    const body: string = await this.getHTML()
    const parsedString: Array<string> | null = body.match(re)

    return parsedString !== null ? Number(parsedString[0]) : 0
  }

  public async setCountOfQuoraPosts(): Promise<any> {
    try {
      const posts = await this.parseHTML()
      this.currentCount = Number(posts)
      await this.firestore.setData(this.fireStoreDir, {
        fields: {
          count: { integerValue: posts },
          created: { timestampValue: new Date().toISOString() }
        }
      })
      return await this.getQuoraPostsMetrics()
    } catch (error: any) {
      console.log(error);
      return new Error(error);
    }
  }

  private async getQuoraPostsMetrics(): Promise<number> {
    const firstDayOfCurrentMonth = moment().startOf('month').toISOString()
    const { data } = await this.firestore.getDataAfterDate(firstDayOfCurrentMonth, this.fireStoreDir, 1)
    const oldCount = (data[0].document?.fields?.count?.integerValue || 0)

    return this.currentCount - oldCount
  }
}

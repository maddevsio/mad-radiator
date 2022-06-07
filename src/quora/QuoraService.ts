import dotenv from 'dotenv';
import got from 'got';
import { Logger } from 'logger';
import moment from 'moment';
import { Firestore } from "utils/firestore"


// eslint-disable-next-line jest/require-hook
dotenv.config();

export class QuoraService {
  private firestore: Firestore

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  private currentCount: number

  // TODO: fix undefined type
  private quoraUserID?: string = process.env.QUORA_USER_ID

  constructor() {
    this.firestore = new Firestore()
    this.currentCount = 0
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
    const posts = this.parseHTML()
    this.currentCount = Number(posts)
    this.firestore.setData(this.fireStoreDir, {
      fields: {
        count: { integerValue: posts },
        created: { timestampValue: new Date() }
      }
    }).then(() => {
      return this.getQuoraPostsMetrics()
    }).catch(() => {
      Logger.error('Failed saving on firestore')
    })
  }

  private async getQuoraPostsMetrics(): Promise<number> {
    const firstDayOfCurrentMonth = moment().startOf('month').toISOString()
    const { data } = await this.firestore.getDataAfterDate(firstDayOfCurrentMonth, this.fireStoreDir)
    const oldCount = data[0].document?.fields?.count?.stringValue
    Logger.info(`Новых статей за месяц: ${this.currentCount - oldCount}`)
    return this.currentCount - oldCount
  }
}

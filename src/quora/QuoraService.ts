import dotenv from 'dotenv';
import got from 'got';
import { Post } from 'interfaces'
import { Firestore } from "utils/firestore"
// import getMonthName from 'utils/getMonthName'

// 230523659
// https://hooks.slack.com/services/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
// eslint-disable-next-line jest/require-hook
dotenv.config();

export class QuoraService {
  private firestore: Firestore

  private readonly url: string = 'https://www.quora.com/profile/'

  private readonly fireStoreDir: string = 'quora'

  // TODO: fix undefined type
  private quoraUserID: string | undefined = process.env.QUORA_USER_ID

  constructor() {
    this.firestore = new Firestore()
  }

  private async parseHTML(): Promise<string> {
    const { body } = await got(`${this.url}${this.quoraUserID}`)
    return body
  }

  private async getCountOfPosts(): Promise<number | null> {
    const re = /(?<=postsCount\\":)\d+/g;
    const body: string = await this.parseHTML()
    const parsedString: Array<string> | null = body.match(re)

    return Number(parsedString !== null ? parsedString[0] : 0)
  }

  private sortPostsByDate(documents: Array<Post>) {
    return documents.sort((a: Post, b: Post) => {
      return new Date(b.createTime).valueOf() - new Date(a.createTime).valueOf()
    });
  }

  private differenceCountOfPosts(countLastPosts: number, countPosts: number): number {
    return countLastPosts - countPosts
  }

  public async calculateCountOfPosts(): Promise<{ count: string }> {
    const { data: { documents } } = await this.firestore.getData(this.fireStoreDir)
    const countLastPosts = await this.getCountOfPosts()
    this.sortPostsByDate(documents)
    const lastCountPosts = Number(documents[0]?.fields?.count?.stringValue)
    const difference: number = this.differenceCountOfPosts(Number(countLastPosts), lastCountPosts)
    const res = {
      fields: {
        count: {
          stringValue: String(countLastPosts)
        }
      }
    }

    await this.firestore.setData(this.fireStoreDir, res)

    return {
      count: difference.toString()
    }
  }
}

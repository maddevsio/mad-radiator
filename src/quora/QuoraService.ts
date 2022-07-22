import axios from 'axios';
import { load } from 'cheerio';
import { QuoraServiceError } from 'errors/QuoraServiceError';
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'

import { QuoraParams } from './interfaces'

export class QuoraService {
  private firestore: Firestore

  private readonly query = 'window.ansFrontendGlobals.data.inlineQueryResults.results';

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
    const req = await axios(`${this.url}${this.quoraUserID}`);
    const html = await req.data;
    const $ = load(html);
    const quoraUrl = this.query;
    // eslint-disable-next-line func-names
    const scripts = $('script').filter(function () {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        $(this)?.html()?.indexOf(quoraUrl) > -1
      );
    });

    const script = $(scripts[2]).html();
    const window = script?.substring(script.indexOf(`${this.query}[`) + (this.query.length + 70));
    const data = window?.substring(0, window.indexOf('}";') + 2);

    if (!data) {
      throw new QuoraServiceError('No data found');
    }

    const { data: { user } } = JSON.parse(JSON.parse(data));

    return Number(user.postsCount);
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

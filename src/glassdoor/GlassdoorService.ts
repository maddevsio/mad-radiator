import axios from 'axios'
import { load } from 'cheerio'
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'

import { GlassdoorParams } from './interfaces/GlassdoorParams'

export class GlassdoorService {
  private readonly url: string = 'https://www.glassdoor.com/Overview/Working-at-Mad-Devs-EI_IE2507466.11,19.htm'

  private firestore: Firestore

  private readonly fireStoreDir: string = 'glassdoor'

  private currentCount: number

  glassdoorUrl?: string

  constructor(glassdoorConfig: GlassdoorParams, firestoreConfig: FirestoreConfig) {
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.glassdoorUrl = glassdoorConfig.glassdoorUrl
  }

  private async getDataFromGlassdoor(url: string) {
    const req = await axios.get(url);
    const $ = load(req.data);
    const selector = $('#EIProductHeaders');
    const reviews = $(selector[0]).find("span.eiHeaderLink")[1];

    return Number($(reviews).text().trim());
  }

  private async getGlassdoorReviewsMetrics(): Promise<number> {
    const oldCount = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), this.fireStoreDir, 1)
    const currentCount = this.currentCount - oldCount
    return currentCount < 0 ? 0 : currentCount
  }

  public async setCountOfGlassdoorReviews(): Promise<any> {
    try {
      const reviews = await this.getDataFromGlassdoor(this.url)
      this.currentCount = reviews

      await this.firestore.setData(this.fireStoreDir, {
        count: reviews,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      })
      return await this.getGlassdoorReviewsMetrics()
    } catch (error: any) {
      return new Error(error)
    }
  }
}
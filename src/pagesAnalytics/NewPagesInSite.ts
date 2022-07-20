import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Logger } from 'logger'
import { Sitemap } from 'sitemap/Sitemap'

import { Firestore } from '../utils/firestore'
import { getFirstDayOfCurrentMonth } from '../utils/getFirstDayOfCurrentMonth'

import { PagesParams } from './interfaces'

export class NewPagesInSite {
  private readonly config: PagesParams

  private readonly sitemap: Sitemap

  private firestore: Firestore

  private currentCount: number

  private readonly firestoreCollectionId: string = 'pages'

  constructor(config: PagesParams, firestoreConfig: FirestoreConfig) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
  }

  public async setCountOfNewPages(): Promise<number> {
    Logger.info('Start getting pages links from sitemap')
    const urls = await this.sitemap.getAllUrls()
    if (urls.length === 0) {
      throw new Error('Sitemap is empty! Metric not collected!')
    }
    this.currentCount = urls.length
    Logger.success(`Count of links from sitemap: ${urls.length}`)
    await this.firestore.setData(this.firestoreCollectionId, {
      count: urls.length,
      created: admin.firestore.Timestamp.fromDate(new Date()),
    })
    return this.getNewPagesAnalyticsMetrics()
  }

  public async getNewPagesAnalyticsMetrics(): Promise<number> {
    Logger.info(`Start getting pages data from firestore`)
    const oldCount = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), this.firestoreCollectionId, 1)
    const currentCount = this.currentCount - oldCount
    return currentCount < 0 ? 0 : currentCount
  }
}

import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Logger } from 'logger'
import moment, { Moment } from 'moment'
import { Sitemap } from 'sitemap/Sitemap'
import { SitemapOptions } from 'sitemap/interfaces'
import { Firestore } from 'utils/firestore'

import { PageAnalyticsData } from './interfaces'

export class PageAnalytics {
  private readonly config: SitemapOptions

  private readonly sitemap: Sitemap

  private readonly firstDayOfCurrentMonth: Moment

  private readonly firstDayOfCurrentWeek: Moment

  private firestore: Firestore

  private currentCount: number

  constructor(config: SitemapOptions, firestoreConfig: FirestoreConfig) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.firstDayOfCurrentMonth = moment().startOf('month')
    this.firstDayOfCurrentWeek = moment().startOf('week')
  }

  private async setCountOfBlogPages(): Promise<any> {
    Logger.info('️Start getting blog links from sitemap')

    const urls = await this.sitemap.getAllUrls()

    if (urls.length) {
      this.currentCount = urls.length
      Logger.success(`Count of links from sitemap: ${urls.length}`)
      Logger.info(`Saving count of links on firestore...`)

      return this.firestore.setData('blog', {
        count: urls.length,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      })
    }
    Logger.error('Something went wrong')
    return null
  }

  private async getCountOfBlogs(date: Moment): Promise<number | null> {
    Logger.info(`Start getting data from firestore`)
    const count = await this.firestore.getDataAfterDate(date, 'blog', 1)
    if (count) {
      const oldCount = count

      Logger.info(`New posts after date ${date}: ${this.currentCount - oldCount}`)
      return this.currentCount - oldCount
    }
    return null
  }

  public async getPageAnalyticsMetrics(): Promise<PageAnalyticsData | null> {
    const data = await this.setCountOfBlogPages()
    if (data) {
      Logger.success('Count saved!')
      try {
        return {
          perMonth: await this.getCountOfBlogs(this.firstDayOfCurrentMonth),
          perWeek: await this.getCountOfBlogs(this.firstDayOfCurrentWeek),
        }
      } catch (error) {
        Logger.error(`Error getting count of blog pages: ${error}`)
        return null
      }
    }
    Logger.error('Failed saving on firestore')
    return null
  }
}

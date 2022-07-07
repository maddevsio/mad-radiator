import { Logger } from 'logger'
import moment from "moment"
import { Sitemap } from 'sitemap/Sitemap'
import { SitemapOptions } from 'sitemap/interfaces'
import { Firestore } from 'utils/firestore'

import { PageAnalyticsData } from "./interfaces"

export class PageAnalytics {
  private readonly config: SitemapOptions

  private readonly sitemap: Sitemap

  private readonly firstDayOfCurrentMonth: string

  private readonly firstDayOfCurrentWeek: string

  private firestore: Firestore

  private currentCount: number

  constructor(config: SitemapOptions, firestoreId: string) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore(firestoreId)
    this.currentCount = 0
    this.firstDayOfCurrentMonth = moment().startOf('month').toISOString()
    this.firstDayOfCurrentWeek = moment().startOf('week').toISOString()
  }

  private async setCountOfBlogPages(): Promise<any> {
    Logger.info('️Start getting blog links from sitemap')

    const urls = await this.sitemap.getAllUrls()

    if (urls.length) {
      this.currentCount = urls.length
      Logger.success(`Count of links from sitemap: ${urls.length}`)
      Logger.info(`Saving count of links on firestore...`)

      return this.firestore.setData('blog', {
        fields: {
          count: { integerValue: urls.length },
          created: { timestampValue: new Date() }
        }
      })
    }
    Logger.error('Something went wrong')
    return null
  }

  private async getCountOfBlogs(date: string): Promise<number | null> {
    Logger.info(`Start getting data from firestore`)
    const { data } = await this.firestore.getDataAfterDate(date, 'blog', 1)
    if (data) {
      const oldCount = data[0].document?.fields?.count?.integerValue

      Logger.info(`New posts after date ${date}: ${this.currentCount - oldCount}`)
      return this.currentCount - oldCount
    }
    return null
  }

  public async getPageAnalyticsMetrics(): Promise<PageAnalyticsData | null> {
    const { data } = await this.setCountOfBlogPages()
    if (data) {
      Logger.success('Count saved!')
      try {
        const blogPagesCount = {
          perMonth: await this.getCountOfBlogs(this.firstDayOfCurrentMonth),
          perWeek: await this.getCountOfBlogs(this.firstDayOfCurrentWeek)
        }

        return blogPagesCount
      } catch (error) {
        Logger.error(`Error getting count of blog pages: ${error}`)
        return null
      }
    }
    Logger.error('Failed saving on firestore')
    return null
  }
}

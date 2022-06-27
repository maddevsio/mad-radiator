// import { Sitemap } from 'lighthouse/Sitemap'
import { Logger } from 'logger'
import { Sitemap } from 'sitemap/Sitemap'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'

import { SitemapOptions } from '../sitemap/interfaces'
import { Firestore } from '../utils/firestore'


// import { Blog } from './interfaces'

export class PageAnalytics {
  private readonly config: SitemapOptions

  private readonly sitemap: Sitemap

  private firestore: Firestore

  private currentCount: number

  constructor(config: SitemapOptions, firestoreId: string) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore(firestoreId)
    this.currentCount = 0
  }

  public async setCountOfBlogPages(): Promise<any> {
    Logger.info('️Start getting blog links from sitemap')
    const urls = await this.sitemap.getAllUrls()

    if (urls.length) {
      this.currentCount = urls.length
      Logger.info(`Saving count of links in the firestore...`)
      this.firestore.setData('blog', {
        fields: {
          count: { integerValue: urls.length },
          created: { timestampValue: new Date() }
        }
      }).then(() => {
        return this.getPageAnalyticsMetrics()
      }).catch((error: any) => {
        console.log(error);
      })
    } else {
      Logger.error('Something went wrong')
    }
  }

  public async getPageAnalyticsMetrics(): Promise<number> {
    const { data } = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), 'blog', 1)
    const oldCount = data[0].document?.fields?.count?.stringValue
    return this.currentCount - oldCount
  }
}

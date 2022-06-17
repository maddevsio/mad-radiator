// import { Sitemap } from 'lighthouse/Sitemap'
import { Logger } from 'logger'
import moment from "moment";
import { Sitemap } from 'sitemap/Sitemap'

import { SitemapOptions } from '../sitemap/interfaces'
import { Firestore } from '../utils/firestore'


// import { Blog } from './interfaces'

export class PageAnalytics {
  private readonly config: SitemapOptions

  private readonly sitemap: Sitemap

  private firestore: Firestore

  private currentCount: number

  constructor(config: SitemapOptions) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore()
    this.currentCount = 0
  }

  public async setCountOfBlogPages(): Promise<any> {
    Logger.info('️Start getting blog links from sitemap')
    const urls = await this.sitemap.getAllUrls()

    if (urls.length) {
      this.currentCount = urls.length
      Logger.success(`Count of links from sitemap: ${urls.length}`)
      Logger.info(`Saving count of links on firestore...`)
      this.firestore.setData('blog', {
        fields: {
          count: { integerValue: urls.length },
          created: { timestampValue: new Date() }
        }
      }).then(({ data }) => {
        Logger.success('Count saved!')
        console.dir(data, { depth: null, maxArrayLength: null });
        return this.getPageAnalyticsMetrics()
      }).catch(() => {
        Logger.error('Failed saving on firestore')
      })
    } else {
      Logger.error('Something went wrong')
    }
  }

  public async getPageAnalyticsMetrics(): Promise<number> {
    Logger.info(`Start getting data from firestore`)
    const firstDayOfCurrentMonth = moment().startOf('month').toISOString()
    const { data } = await this.firestore.getDataAfterDate(firstDayOfCurrentMonth, 'blog', 1)
    console.dir(data, { depth: null, maxArrayLength: null });
    const oldCount = data[0].document?.fields?.count?.stringValue
    Logger.info(`Новых статей за месяц: ${this.currentCount - oldCount}`)
    return this.currentCount - oldCount
  }
}

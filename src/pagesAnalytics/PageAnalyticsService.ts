/* eslint-disable */
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Logger } from 'logger'
import { Sitemap } from 'sitemap/Sitemap'
import { SitemapOptions } from 'sitemap/interfaces'
import { Firestore } from 'utils/firestore'
import { BuildMessageDataSpec } from '../messengers/interfaces'
import { PrismicService } from '../prismic/PrismicService'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'

import { PageAnalyticsData } from './interfaces'

export class PageAnalyticsService implements RadiatorService {
  private readonly config: SitemapOptions

  private readonly sitemap: Sitemap

  private firestore: Firestore

  private currentCount: number

  constructor(config: SitemapOptions, firestoreConfig: FirestoreConfig) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
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

  public async getPageAnalyticsMetrics(): Promise<PageAnalyticsData | null> {
    const data = await this.setCountOfBlogPages()
    const prismicService = new PrismicService()
    if (data) {
      Logger.success('Count saved!')
      try {
        const perMonthData = await prismicService.getBlogPagesForMonth()
        const perWeekData = await prismicService.getBlogPagesForWeek()
        return {
          perMonth: perMonthData?.total_results_size,
          perWeek: perWeekData?.total_results_size,
          total: this.currentCount,
        }
      } catch (error) {
        Logger.error(`Error getting count of blog pages: ${error}`)
        return null
      }
    }
    Logger.error('Failed saving on firestore')
    return null
  }

  public getName(): string {
    return this.constructor.name
  }

  async perform(
    results: BuildMessageDataSpec,
    _radiator: RadiatorSpec,
  ): Promise<BuildMessageDataSpec> {
    return Object.assign(results, {
      pageAnalytics: await executeWithRetry(
        `${this.getName()}.getPageAnalyticsMetrics()`,
        5,
        1500,
        () => this.getPageAnalyticsMetrics(),
        (error: any) => error,
      ),
    })
  }
}

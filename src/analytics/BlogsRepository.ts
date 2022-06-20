import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload } from 'analytics/interfaces'

import { Blog } from './interfaces'

/**
 * Blogs repository
 */
export class BlogsRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ name: 'screenPageViews' }]

  /**
   * GA dimensions
   */
  dimensions = [{ name: 'pagePath' }]

  /**
   * Get data from GA
   */

  public async getData(): Promise<Array<Blog>> {
    const { websiteUrl, pagesPathForViewsAnalytics } = this.config
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    reports.rows = reports.rows
      .filter((row: AnalyticDataRows) => row.dimensionValues[1]?.value === 'date_range_0')

    return BlogsRepository.format(reports, websiteUrl, pagesPathForViewsAnalytics)
  }

  /**
   * Format row GA4 data
   */
  private static format(reports: AnalyticsPayload, websiteUrl: string, pagesPathForViewsAnalytics?: Array<string>): Array<Blog> {

    const correctWebsiteUrl = websiteUrl.replace(/\/*$/gi, '')
    const reportsDataPath = reports?.rows

    if (pagesPathForViewsAnalytics?.length) {
      const filteredPages = BlogsRepository.filterPages(reportsDataPath, pagesPathForViewsAnalytics)

      return BlogsRepository.getTopPagesViewsStatistics(filteredPages, correctWebsiteUrl)
    }

    return []
  }

  private static getTopPagesViewsStatistics(reports: Array<AnalyticDataRows>, websiteUrl: string) {
    return reports.map(
      (report): Blog => ({
        pagePath: `${websiteUrl}${report.dimensionValues[0].value}`,
        pageViews: Number(report.metricValues[0].value),
      }))
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 3)
  }

  private static filterPages(allPages: Array<AnalyticDataRows>, pagesPathList: Array<string>) {
    return pagesPathList.map(pagePath => allPages.filter((filteredPage: AnalyticDataRows) => {
      const filteredPagePath = filteredPage.dimensionValues[0].value
      return filteredPagePath.includes(pagePath) && filteredPagePath !== pagePath
    })).flat()
  }
}

import { Repository } from 'analytics/Repository'
import { AnalyticsDataRow, AnalyticsPayload } from 'analytics/interfaces'

import { Blog } from './interfaces'

/**
 * Blogs repository
 */
export class BlogsRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ expression: 'ga:pageviews' }]

  /**
   * GA dimensions
   */
  dimensions = [{ name: 'ga:pagePath' }]

  /**
   * Get data from GA
   */

  public async getData(): Promise<Array<Blog>> {
    const { websiteUrl, pagesPathForViewsAnalytics } = this.config
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return BlogsRepository.format(reports, websiteUrl, pagesPathForViewsAnalytics)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload, websiteUrl: string, pagesPathForViewsAnalytics?: Array<string>): Array<Blog> {

    const reportsDataPath = reports[0].data.rows

    if (pagesPathForViewsAnalytics?.length) {
      const filteredPages = BlogsRepository.filterPages(reportsDataPath, pagesPathForViewsAnalytics)
      return BlogsRepository.getTopPagesViewsStatistics(filteredPages, websiteUrl)
    }
    return []
  }

  private static getTopPagesViewsStatistics(reports: Array<AnalyticsDataRow>, websiteUrl: string) {
    return reports.map(
      (report): Blog => ({
        pagePath: `${websiteUrl}${report.dimensions[0]}`,
        pageViews: Number(report.metrics[0].values[0]),
      }))
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 3)
  }

  private static filterPages(allPages: Array<AnalyticsDataRow>, pagesPathList: Array<string>) {
    return pagesPathList.map(pagePath => allPages.filter(filteredPage => {
      const filteredPagePath = filteredPage.dimensions[0]
      return filteredPagePath.includes(pagePath) && filteredPagePath !== pagePath
    })).flat()
  }
}

import { Repository } from 'analytics/Repository'
import { AnalyticsDataRow, AnalyticsPayload } from 'analytics/interfaces'

import { Blog } from './interfaces/blogs.interface'

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
    const { websiteUrl, pagePathsListForAnalytics } = this.config
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return BlogsRepository.format(reports, websiteUrl, pagePathsListForAnalytics)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload, websiteUrl: string, pagePathsListForAnalytics: Array<string>): Array<Blog> {

    const reportsDataPath = reports[0].data.rows

    if (pagePathsListForAnalytics?.length) {
      const filteredPages = BlogsRepository.filterPages(reportsDataPath, pagePathsListForAnalytics)
      return BlogsRepository.getTopPagesViewsStatistics(filteredPages, websiteUrl)
    }
    return BlogsRepository.getTopPagesViewsStatistics(reportsDataPath, websiteUrl)
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

  private static filterPages(allPages: Array<AnalyticsDataRow>, pagePathList: Array<string>) {
    return pagePathList.map(pagePath => allPages.filter(page => page.dimensions[0].includes(pagePath))).flat()
  }
}

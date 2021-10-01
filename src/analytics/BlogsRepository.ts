import { Repository } from 'analytics/Repository'
import { AnalyticsPayload } from 'analytics/interfaces'

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
    const { websiteUrl, PagePathsListForAnalytics } = this.config
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return BlogsRepository.format(reports, websiteUrl, PagePathsListForAnalytics)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload, websiteUrl: string, PagePathsListForAnalytics: Array<string>): Array<Blog> {

    return PagePathsListForAnalytics
      .map(pagePath => reports[0].data.rows.filter(row => row.dimensions[0].includes(pagePath))).flat()
      .map(
        (row): Blog => ({
          pagePath: `${websiteUrl}${row.dimensions[0]}`,
          pageViews: Number(row.metrics[0].values[0]),
        }),
      )
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 3)
  }
}

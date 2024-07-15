import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload } from 'analytics/interfaces'

import { Page } from './interfaces'

/**
 * Pages repository
 */

export class PagesRepository extends Repository {
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

  public async getData(): Promise<Array<Page>> {
    const { websiteUrl, pagesPathForViewsAnalytics } = this.config
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    reports.rows = reports.rows.filter(
      (row: AnalyticDataRows) => row.dimensionValues[1]?.value === 'date_range_0',
    )

    return PagesRepository.format(reports, websiteUrl, pagesPathForViewsAnalytics)
  }

  /**
   * Format row GA4 data
   */
  private static format(
    reports: AnalyticsPayload,
    websiteUrl: string,
    pagesPathListToExclude?: Array<string>,
  ): Array<Page> {
    const correctWebsiteUrl = websiteUrl.replace(/\/*$/gi, '')
    const reportsDataPath = reports?.rows

    if (pagesPathListToExclude?.length) {
      const filteredPages = PagesRepository.filterPages(reportsDataPath, pagesPathListToExclude)
      return PagesRepository.getTopPagesViewsStatistics(filteredPages, correctWebsiteUrl)
    }

    return []
  }

  private static getTopPagesViewsStatistics(reports: Array<AnalyticDataRows>, websiteUrl: string) {
    return reports
      .map(
        (report): Page => ({
          pagePath: `${websiteUrl}${report.dimensionValues[0].value}`,
          pageViews: Number(report.metricValues[0].value),
        }),
      )
      .filter(page => page.pagePath !== `${websiteUrl}/`)
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 3)
  }

  private static filterPages(
    allPages: Array<AnalyticDataRows>,
    pagesPathListToExclude: Array<string>,
  ) {
    return allPages
      .filter(page => {
        const pagePath = page.dimensionValues[0].value
        return !pagesPathListToExclude.some(path => pagePath.includes(path) && path !== pagePath)
      })
      .flat()
  }
}

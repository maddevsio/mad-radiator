import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload, EbookDownloads } from 'analytics/interfaces'

/**
 * Submit Ebook repository
 */
export class EbookDownloadsRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ name: 'eventCount' }]

  /**
   * GA4 dimensions
   */
  dimensions = [{ name: 'eventName' }]

  /**
   * GA4 dateRanges
   */

  dateRanges = [
    {
      startDate: '30daysAgo',
      endDate: '1daysAgo',
    },
  ]

  /**
   * Get data from GA4
   */
  public async getData(): Promise<Array<EbookDownloads>> {
    const reports = await this.getAnalytics(this.metrics, this.dimensions, this.dateRanges)
    reports.rows = reports.rows
      .filter(
        (row: AnalyticDataRows) => row.dimensionValues[0]?.value === 'submit_pricing_strategies_ebook_form'
          || row.dimensionValues[0]?.value === 'submit_approach_dp_ebook_form',
      )
    return EbookDownloadsRepository.format(reports)
  }

  /**
   * Format raw GA4 data
   */
  private static format(reports: AnalyticsPayload): Array<EbookDownloads> {
    return reports?.rows
      .map(
        (row: AnalyticDataRows): EbookDownloads => {
          let name = '' // todo change to .reduce
          if (row.dimensionValues[0].value === 'submit_pricing_strategies_ebook_form') {
            name = 'Pricing Strategies'
          }
          if (row.dimensionValues[0].value === 'submit_approach_dp_ebook_form') {
            name = 'Approach Development Process'
          }
          return {
            value: Number(row.metricValues[0].value),
            name: String(name),
          }
        },
      )
  }
}

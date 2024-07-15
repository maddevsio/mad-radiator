import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, EbookDownloads } from 'analytics/interfaces'

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
    return reports.rows.reduce((acc: Array<EbookDownloads>, row: AnalyticDataRows) => {
      if (row.dimensionValues[0]?.value === 'submit_pricing_strategies_ebook_form') {
        acc.push({
          value: Number(row.metricValues[0].value),
          name: 'Pricing Strategies',
        })
      }
      if (row.dimensionValues[0]?.value === 'submit_approach_dp_ebook_form') {
        acc.push({
          value: Number(row.metricValues[0].value),
          name: 'Approach Development Process',
        })
      }
      if (row.dimensionValues[0]?.value === 'submit_engineerings_handbook_form') {
        acc.push({
          value: Number(row.metricValues[0].value),
          name: 'Mad Devs Engineering’s Handbook',
        })
      }
      if (row.dimensionValues[0]?.value === 'submit_transparent_relationships_ebook_f') {
        acc.push({
          value: Number(row.metricValues[0].value),
          name: 'Transparent Relationships With Stakeholders',
        })
      }
      return acc
    }, <Array<AnalyticDataRows>>[])
  }
}

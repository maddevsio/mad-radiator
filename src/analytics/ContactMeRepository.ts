import { Repository } from 'analytics/Repository'
import {
  AnalyticDataRows,
  AnalyticsPayload,
  ContactMe,
  ContactMeMetrics,
} from 'analytics/interfaces'

/**
 * Submit Contact Me repository
 */
export class ContactMeRepository extends Repository {
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

  monthDateRanges = [
    {
      startDate: '30daysAgo',
      endDate: '1daysAgo',
    },
  ]

  dayDateRanges = [
    {
      startDate: '2daysAgo',
      endDate: '1daysAgo',
    },
  ]

  /**
   * Get data from GA4
   */
  public async getData(): Promise<ContactMeMetrics> {
    return {
      contactMePerDay: await this.getDayData(),
      contactMePerMonth: await this.getMonthData(),
    }
  }

  public async getMonthData(): Promise<ContactMe> {
    const monthReport = await this.getAnalytics(this.metrics, this.dimensions, this.monthDateRanges)

    return ContactMeRepository.format(monthReport)
  }

  public async getDayData(): Promise<ContactMe> {
    const dayReport = await this.getAnalytics(this.metrics, this.dimensions, this.dayDateRanges)

    return ContactMeRepository.format(dayReport)
  }

  /**
   * Format raw GA4 data
   */
  private static format(reports: AnalyticsPayload): ContactMe {
    const reportRows = reports.rows.filter(
      (row: AnalyticDataRows) => row.dimensionValues[0]?.value === 'submit_contact_me',
    )
    const [contactMe] = reportRows?.length
      ? reportRows?.map(
          (row: AnalyticDataRows): ContactMe => ({
            value: Number(row.metricValues[0].value),
          }),
        )
      : [{ value: 0 }]
    return contactMe
  }
}

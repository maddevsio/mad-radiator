import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload, Country } from 'analytics/interfaces'
import { Rate } from 'interfaces'

/**
 * Countries repository
 */
export class CountriesRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ name: 'totalUsers' }]

  /**
   * GA4 dimensions
   */
  dimensions = [{ name: 'country' }]

  /**
   * Get data from GA4
   */
  public async getData(): Promise<Array<Country>> {
    const reports = await this.getAnalytics(this.metrics, this.dimensions)

    reports.rows = reports.rows.filter(
      (row: AnalyticDataRows) => row.dimensionValues[1]?.value === 'date_range_0',
    )

    return CountriesRepository.format(reports)
  }

  /**
   * Format raw GA4 data
   */
  private static format(reports: AnalyticsPayload): Array<Country> {
    const total: number = CountriesRepository.getTotal(reports)

    return reports?.rows
      .map(
        (row: AnalyticDataRows): Country => ({
          title:
            row.dimensionValues[0].value === '(not set)' ? 'Other' : row.dimensionValues[0].value,
          value: Number(row.metricValues[0].value),
          percentage: CountriesRepository.getPercentage(Number(row.metricValues[0].value), total),
          rate: Rate.neutral,
        }),
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }

  /**
   * Get total from report
   */
  private static getTotal(reports: AnalyticsPayload): number {
    return reports?.totals[0].metricValues[0].value
  }

  /**
   * Get percentage for number from total
   */
  private static getPercentage(toCalculate: number, total: number): number {
    return Number(Number((toCalculate * 100) / total).toFixed(2))
  }
}

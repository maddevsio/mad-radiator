import { Repository } from 'analytics/Repository'
import { AnalyticsPayload, Country } from 'analytics/interfaces'
import { Rate } from 'interfaces'

/**
 * Countries repository
 */
export class CountriesRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ expression: 'ga:users' }]

  /**
   * GA dimensions
   */
  dimensions = [{ name: 'ga:country' }]

  /**
   * Get data from GA
   */
  public async getData(): Promise<Array<Country>> {
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    
    return CountriesRepository.format(reports)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload): Array<Country> {
    const total: number = CountriesRepository.getTotal(reports)

    return reports[0].data.rows
      .map(
        (row): Country => ({
          title: row.dimensions[0] === '(not set)' ? 'Other' : row.dimensions[0],
          value: Number(row.metrics[0].values[0]),
          percentage: CountriesRepository.getPercentage(Number(row.metrics[0].values[0]), total),
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
    return reports[0].data.totals[0].values[0]
  }

  /**
   * Get percentage for number from total
   */
  private static getPercentage(toCalculate: number, total: number): number {
    return Number(Number((toCalculate * 100) / total).toFixed(2))
  }
}

import { AnalyticsRepository } from 'analytics/AnalyticsRepository'
import { Rate } from 'enums'
import { AnalyticsPayload, Country } from 'interfaces/analytics'
import { getPercentage } from 'utils/getPercentage'

export class AnalyticsCountries extends AnalyticsRepository {
  protected metrics = [{ expression: 'ga:users' }]

  protected dimensions = [{ name: 'ga:country' }]

  public async getData(): Promise<Array<Country>> {
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return this.format(reports)
  }

  private format(reports: AnalyticsPayload): Array<Country> {
    const total: number = AnalyticsCountries.getTotal(reports)

    return reports[0].data.rows
      .map(
        (row): Country => ({
          title: row.dimensions[0] === '(not set)' ? 'Other' : row.dimensions[0],
          value: Number(row.metrics[0].values[0]),
          percentage: getPercentage(Number(row.metrics[0].values[0]), total, false),
          rate: Rate.neutral,
        }),
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }

  private static getTotal(reports: AnalyticsPayload): number {
    return reports[0].data.totals[0].values[0]
  }
}

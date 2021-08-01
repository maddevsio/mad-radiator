import { Repository } from 'analytics/Repository'
import { Range } from 'interfaces'

/**
 * Repository for charts
 */
export class ChartRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ expression: `ga:${this.config.chart?.type}` }]

  /**
   * GA dimensions
   * not needed for charts
   */
  dimensions = undefined

  /**
   * maxRangeItems for GA
   * It is necessary to reduce the number of requests to the GA and build a good graph
   */
  private static maxRangeItems = 20

  /**
   * Get data from GA
   */
  public async getData(): Promise<Record<string, number>> {
    const rangeList = ChartRepository.buildRange(this.config.chart?.period)

    const result: Record<string, number> = {}

    for (const [originalDate, range] of Object.entries(rangeList)) {
      const payload = await this.getAnalytics(this.metrics, [], [range])
      result[originalDate] = Number(payload[0].data.rows[0].metrics[0].values[0])
    }

    return result
  }

  /**
   * Get datestring from today - daysToSubtract
   */
  private static getDatestring(daysToSubtract: number): string {
    const date = new Date()
    date.setDate(date.getDate() - daysToSubtract)
    const [month, day, year] = date.toLocaleDateString().split('/')
    return `${day}/${month}/${year}`
  }

  /**
   * Build range for get data from analytics
   */
  private static buildRange(period: number = 14): Record<string, Range> {
    const filterDivisor =
      period > ChartRepository.maxRangeItems
        ? Math.round(period / ChartRepository.maxRangeItems)
        : 1

    return new Array(period)
      .fill(0)
      .map((_, idx) => idx + 1)
      .reverse()
      .filter(item => item % filterDivisor === 0)
      .reduce((acc, idx) => {
        const date = ChartRepository.getDatestring(idx)
        return {
          ...acc,
          [date]: {
            startDate: `${idx}DaysAgo`,
            endDate: `${idx}DaysAgo`,
          },
        }
      }, {})
  }
}

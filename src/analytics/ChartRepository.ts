import { Repository } from 'analytics/Repository'
import { ParsedRange, RangeWithDisplay } from 'interfaces'

/**
 * Repository for charts
 */
export class ChartRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ name: `${this.config.chart?.type}` }]

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

  private static filterDivisor = 0;

  /**
   * Get data from GA
   */
  public async getData(): Promise<Record<string, number>> {
    const rangeList = ChartRepository.buildRange(this.range, this.config.chart?.period)

    const result: Record<string, number> = {}

    for (const { dateToDisplay, startDate, endDate } of rangeList) {
      const payload: any = await this.getAnalytics(this.metrics, [], [{ startDate, endDate }])
      result[dateToDisplay] = Number(payload?.rows[0].metricValues[0].value)
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
  private static buildRange(range: ParsedRange, period: number = 14): Array<RangeWithDisplay> {
    if (!range.range) return []

    if (range.range === 'week') {
      ChartRepository.filterDivisor = 7;
    }

    if (range.range === 'day') {
      ChartRepository.filterDivisor = period > ChartRepository.maxRangeItems
        ? Math.round(period / ChartRepository.maxRangeItems)
        : 1
    }

    return new Array(period)
      .fill(0)
      .map((_, idx) => idx + 1)
      .reverse()
      .filter(idx => idx === 1 || idx % ChartRepository.filterDivisor === 0)
      .map(idx => {
        const dateToDisplay = ChartRepository.getDatestring(idx)
        return {
          dateToDisplay,
          startDate: `${range.range === 'week' ? idx + ChartRepository.filterDivisor : idx}daysAgo`,
          endDate: `${idx}daysAgo`,
        }
      })
  }
}

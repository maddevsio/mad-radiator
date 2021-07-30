import { AnalyticsRepository } from 'analytics/AnalyticsRepository'
import { Range } from 'interfaces'

export class AnalyticsChart extends AnalyticsRepository {
  metrics = [{ expression: `ga:${this.config.chart?.type}` }]

  dimensions = undefined

  public async getData(): Promise<Record<string, number>> {
    const rangeList = AnalyticsChart.buildRange()

    const result: Record<string, number> = {}

    await Promise.all(
      Object.entries(rangeList).map(async ([originalDate, range]) => {
        await AnalyticsChart.delay() // for delay on 100ms
        const payload = await this.getAnalytics(this.metrics, [], [range])
        result[originalDate] = Number(payload[0].data.rows[0].metrics[0].values[0])
      }),
    )

    return result
  }

  private static getDatestring(subtractAmount: number): string {
    const date = new Date()
    date.setDate(date.getDate() - subtractAmount)
    const [month, day, year] = date.toLocaleDateString().split('/')
    const key = `${day}/${month}/${year}`
    return key
  }

  private static buildRange(period: number = 14): Record<string, Range> {
    return new Array(period)
      .fill(0)
      .map((_, idx) => idx + 1)
      .reverse()
      .reduce((acc, idx) => {
        const date = AnalyticsChart.getDatestring(idx)
        return {
          ...acc,
          [date]: {
            startDate: `${idx}DaysAgo`,
            endDate: `${idx}DaysAgo`,
          },
        }
      }, {})
  }

  private static delay(): Promise<void> {
    return new Promise<void>(res => setTimeout(() => res(), 300))
  }
}

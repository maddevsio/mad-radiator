import { Rate } from 'enums'
import { analyticsreporting_v4, google } from 'googleapis'
import { ParsedRange, RadiatorConfig, Range } from 'interfaces'
import {
  AnalyticsData,
  AnalyticsDimension,
  AnalyticsMetric,
  AnalyticsPayload,
  CoreItems,
  Country,
  Device,
  DeviceTitle,
  Goals,
} from 'interfaces/analytics'
import { formatTime } from 'utils/formatTime'
import { getPercentage } from 'utils/getPercentage'

const delay = () => new Promise<void>(res => setTimeout(() => res(), 300))

const build2WeeksRange = (): Record<string, Range> => {
  const today = new Date()
  today.setDate(today.getDate() - 14)
  const range: Record<string, Range> = {}

  for (let i = 14; i > 0; i -= 1) {
    const [month, day, year] = today.toLocaleDateString().split('/')
    const date = `${day}/${month}/${year}`
    range[date] = {
      startDate: `${i}DaysAgo`,
      endDate: `${i}DaysAgo`,
    }
    today.setDate(today.getDate() + 1)
  }
  return range
}

export class AnalyticsService {
  private config: RadiatorConfig

  private range: ParsedRange

  private googleAnalytics: analyticsreporting_v4.Analyticsreporting

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
    this.googleAnalytics = google.analyticsreporting('v4')
  }

  public async getData(): Promise<AnalyticsData> {
    const core = await this.getCoreData()
    const countries = await this.getCountriesData()
    const devices = await this.getDevicesData()
    const goals = await this.getGoalsData()
    const chart = await this.getChartData()

    const data: AnalyticsData = {
      core,
      countries,
      devices,
      goals,
      chart,
    }

    return data
  }

  private async getAnalytics(
    metrics: Array<AnalyticsMetric>,
    dimensions: Array<AnalyticsDimension>,
    dateRanges: Array<Range> = [this.range.originalRange, this.range.previousRange],
  ): Promise<AnalyticsPayload> {
    const response = await this.googleAnalytics.reports.batchGet({
      // @ts-ignore
      requestBody: {
        reportRequests: [
          {
            viewId: this.config.analyticsViewId,
            dateRanges,
            metrics,
            dimensions,
          },
        ],
      },
    })

    const payload = response.data.reports as AnalyticsPayload | undefined
    return payload || ([] as AnalyticsPayload)
  }

  private async getChartData(): Promise<Record<string, number>> {
    const metrics: Array<AnalyticsMetric> = [{ expression: 'ga:users' }]
    const rangeList = build2WeeksRange()
    const result: Record<string, number> = {}

    for (const [originalDate, range] of Object.entries(rangeList)) {
      await delay() // for delay on 100ms
      const payload = await this.getAnalytics(metrics, [], [range])
      result[originalDate] = Number(payload[0].data.rows[0].metrics[0].values[0])
    }

    return result
  }

  private async getCoreData(): Promise<CoreItems> {
    const metrics: Array<AnalyticsMetric> = [
      { expression: 'ga:users' },
      { expression: 'ga:sessions' },
      { expression: 'ga:bounceRate' },
      { expression: 'ga:avgSessionDuration' },
    ]
    const reports: AnalyticsPayload = await this.getAnalytics(metrics, [])

    const [users, sessions, bounceRate, duration] = reports[0].data.totals[0].values.map(n =>
      Number(Number(n).toFixed(2)),
    )
    const [
      usersPrev,
      sessionsPrev,
      bounceRatePrev,
      durationPrev,
    ] = reports[0].data.totals[1].values.map(n => Number(Number(n).toFixed(2)))

    const usersDifference = getPercentage(users, usersPrev)
    const sessionsDifference = getPercentage(sessions, sessionsPrev)
    const bounceRateDifference = getPercentage(bounceRate, bounceRatePrev)
    const durationDifference = getPercentage(duration, durationPrev)

    return {
      users: {
        value: users,
        previous: usersPrev,
        difference: String(usersDifference > 0 ? `+${usersDifference}` : usersDifference),
        rate: usersDifference > 0 ? Rate.good : Rate.bad,
      },
      sessions: {
        value: sessions,
        previous: sessionsPrev,
        difference: String(sessionsDifference > 0 ? `+${sessionsDifference}` : sessionsDifference),
        rate: sessionsDifference > 0 ? Rate.good : Rate.bad,
      },
      bounceRate: {
        value: bounceRate,
        previous: bounceRatePrev,
        difference: String(
          bounceRateDifference > 0 ? `+${bounceRateDifference}` : bounceRateDifference,
        ),
        rate: bounceRateDifference < 0 ? Rate.good : Rate.bad,
      },
      duration: {
        value: formatTime(duration),
        previous: formatTime(durationPrev),
        difference: String(durationDifference > 0 ? `+${durationDifference}` : durationDifference),
        rate: durationDifference > 0 ? Rate.good : Rate.bad,
      },
    }
  }

  private async getCountriesData(): Promise<Array<Country>> {
    const metrics: Array<AnalyticsMetric> = [{ expression: 'ga:users' }]
    const dimensions: Array<AnalyticsDimension> = [{ name: 'ga:country' }]

    const reports = await this.getAnalytics(metrics, dimensions)

    const total: number = reports[0].data.totals[0].values[0]

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

  private async getDevicesData(): Promise<Array<Device>> {
    const metrics: Array<AnalyticsMetric> = [{ expression: 'ga:users' }]
    const dimensions: Array<AnalyticsDimension> = [{ name: 'ga:deviceCategory' }]
    const reports = await this.getAnalytics(metrics, dimensions)

    const total: number = reports[0].data.totals[0].values[0]
    const totalPrev: number = reports[0].data.totals[1].values[0]

    return reports[0].data.rows
      .map(
        (row): Device => ({
          title: row.dimensions[0].toLowerCase() as DeviceTitle,
          value: getPercentage(Number(row.metrics[0].values[0]), total, false),
          previous: getPercentage(Number(row.metrics[1].values[0]), totalPrev, false),
        }),
      )
      .map(
        (device): Device => ({
          ...device,
          rate: device.value >= device.previous ? Rate.good : Rate.neutral,
        }),
      )
      .sort((a, b) => b.value - a.value)
  }

  private async getGoalsData(): Promise<Goals> {
    const transformGoalsToMetrics = (goals: Array<Number>): Array<AnalyticsMetric> =>
      goals.map(goal => ({
        expression: `ga:goal${goal}Completions`,
      }))

    const calculateValue = (entity: AnalyticsPayload) => ({
      value:
        entity[0] && entity[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
      previous:
        entity[0] && entity[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
    })

    const rawGoals = await Promise.all(
      this.config.analyticsConversions.map(async conversion => {
        const data = await this.getAnalytics(transformGoalsToMetrics(conversion.goals), [])
        return {
          data,
          conversion,
        }
      }),
    )

    return rawGoals.map(goal => {
      const { value, previous } = calculateValue(goal.data)
      const rate = value > previous ? Rate.good : Rate.bad

      return {
        name: goal.conversion.name,
        emoji: goal.conversion.emoji,
        value,
        previous,
        rate,
      }
    })
  }
}

import fs from 'fs'
import path from 'path'

import { Rate } from 'enums'
import { google } from 'googleapis'
import { ParsedRange, RadiatorConfig } from 'interfaces'
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
import { LoggerService } from 'services/Logger.service'
import { formatTime } from 'utils/formatTime'
import { getPercentage } from 'utils/getPercentage'

/**
 * Path to keys.json file
 */
const KEYS_FILEPATH = path.join(__dirname, 'keys.json')

const googleAnalytics = google.analyticsreporting('v4')

export class AnalyticsService {
  private config: RadiatorConfig

  private range: ParsedRange

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
  }

  public async getData(): Promise<AnalyticsData> {
    await this.authorize()

    const core = await this.getCoreData()
    const countries = await this.getCountriesData()
    const devices = await this.getDevicesData()
    const goals = await this.getGoalsData()

    const data: AnalyticsData = {
      core,
      countries,
      devices,
      goals,
    }

    await this.unlinkKeysFile()
    return data
  }

  private async authorize() {
    await this.buildKeysFile(this.config)

    const auth = new google.auth.GoogleAuth({
      keyFilename: KEYS_FILEPATH,
      scopes: ['https://www.googleapis.com/auth/analytics'],
    })

    google.options({ auth })
  }

  private async getAnalytics(
    metrics: Array<AnalyticsMetric>,
    dimensions: Array<AnalyticsDimension>,
  ): Promise<AnalyticsPayload> {
    const response = await googleAnalytics.reports.batchGet({
      // @ts-ignore
      requestBody: {
        reportRequests: [
          {
            viewId: this.config.analyticsViewId,
            dateRanges: [this.range.originalRange, this.range.previousRange],
            metrics,
            dimensions,
          },
        ],
      },
    })

    const payload = response.data.reports as AnalyticsPayload | undefined
    return payload || ([] as AnalyticsPayload)
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

  private async buildKeysFile(config: RadiatorConfig) {
    const fileData = `{
    "type": "${config.env.authType}",
    "project_id": "${config.env.analyticsProjectId}",
    "private_key_id": "${config.env.analyticsPrivateKeyId}",
    "private_key": "${config.env.analyticsPrivateKey}",
    "client_email": "${config.env.analyticsClientEmail}",
    "client_id": "${config.env.analyticsClientId}",
    "auth_uri": "${config.env.analyticsAuthUrl}",
    "token_uri": "${config.env.analyticsTokenUri}",
    "auth_provider_x509_cert_url": "${config.env.analyticsProviderCertUrl}",
    "client_x509_cert_url": "${config.env.analyticsClientCertUrl}"
  }`

    await fs.writeFile(
      KEYS_FILEPATH,
      fileData,
      error => error && LoggerService.error(`Write file error: ${error}`),
    )
  }

  private async unlinkKeysFile() {
    await fs.unlink(KEYS_FILEPATH, error => error && LoggerService.error(`Unlink error: ${error}`))
  }
}

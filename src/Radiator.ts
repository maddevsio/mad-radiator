import * as Sentry from '@sentry/node'
import { AnalyticsService } from 'analytics'
import { GoogleAuthorization } from 'authorization'
import { ChartBuilder } from 'chartBuilder'
import { MessengersParams, ParsedRange, RadiatorConfig, ScheduleConfig, SentryParams } from 'interfaces'
import { Lighthouse } from 'lighthouse'
import { Logger } from 'logger'
import { MessengersService } from 'messengers'
import { Scheduler } from 'scheduler'
import { GoogleDriveStorage } from 'storage'
import { parseRange } from 'utils/parseRange'

import { AnalyticsParams } from './analytics/interfaces'
import { LighthouseParams } from './lighthouse/interfaces'

export class Radiator {
  private readonly config: RadiatorConfig

  private readonly parsedRange: ParsedRange

  private sentryParams: SentryParams | undefined

  private messengersParams: MessengersParams | undefined

  private googleAuthorization: GoogleAuthorization

  private analyticsService: AnalyticsService | undefined

  private lighthouse: Lighthouse | undefined

  private chartBuilder: ChartBuilder | undefined

  private googleDriveStorage: GoogleDriveStorage | undefined

  private scheduler: Scheduler | undefined

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range)
    this.messengersParams = { websiteUrl: config.websiteUrl }

    // instances
    this.googleAuthorization = new GoogleAuthorization(this.config)
  }

  public scheduleJob(scheduleParams: ScheduleConfig) {
    this.scheduler = new Scheduler(scheduleParams || ({} as ScheduleConfig))
    this.scheduler.scheduleJob(() => this.run())
    Logger.info('Job successfully scheduled')
  }

  private static sentryInit(sentryParams: SentryParams) {
    Logger.info('Sentry initialization...')
    Sentry.init({
      dsn: sentryParams.sentryDSN,
      tracesSampleRate: sentryParams.tracesSampleRate,
    })
  }

  public useSentry(sentryParams: SentryParams) {
    this.sentryParams = sentryParams
  }

  public useAnalytics(analyticsParams: AnalyticsParams) {
    this.analyticsService = new AnalyticsService({
      ...analyticsParams,
      websiteUrl: this.config.websiteUrl,
    }, this.parsedRange)
    this.useChartBuilder()
    this.useGoogleDriveStorage()
  }

  public useLighthouse(lighthouseParams: LighthouseParams) {
    this.lighthouse = new Lighthouse(
      {
        ...lighthouseParams,
        websiteUrl: this.config.websiteUrl,
      },
    )
  }

  private useChartBuilder() {
    this.chartBuilder = new ChartBuilder()
  }

  private useGoogleDriveStorage() {
    this.googleDriveStorage = new GoogleDriveStorage()
  }

  public useTelegram(telegramParams: MessengersParams) {
    this.messengersParams = {
      ...(this.messengersParams),
      ...telegramParams,
    }
  }

  public useSlack(slackParams: MessengersParams) {
    this.messengersParams = {
      ...(this.messengersParams),
      ...slackParams,
    }
  }

  public async run() {
    try {
      let analytics
      let lighthouse
      let imageBuffer
      let imageURL

      if (this.sentryParams && this.sentryParams.sentryDSN) Radiator.sentryInit(this.sentryParams)

      Logger.info('Authorize with googleAuthorization...')
      const googleAuthorization = await this.googleAuthorization.authorize()

      if (this.analyticsService) {
        Logger.info('Getting analytics data...')
        analytics = await this.analyticsService.getData()
      }

      if (this.lighthouse) {
        Logger.info('Getting lighthouse data...')
        lighthouse = await this.lighthouse.getLighthouseMetrics()
      }

      if (analytics && this.chartBuilder) {
        Logger.info('Building an image...')
        imageBuffer = analytics.chart && (await this.chartBuilder.renderChart(analytics.chart))
      }

      if (imageBuffer && this.googleDriveStorage) {
        Logger.info('Saving an image in gdrive...')
        imageURL = imageBuffer && (await this.googleDriveStorage.storeFile(imageBuffer))
      }

      if (googleAuthorization && this.messengersParams) {
        Logger.info('Send messages...')
        const messengersService = new MessengersService(this.messengersParams)
        await messengersService.sendMessages({
          analytics,
          lighthouse,
          range: this.parsedRange,
          imageURL,
        })
        await googleAuthorization.unlink()
        Logger.success('Success!')
      }

    } catch (error) {
      Logger.error(error)
      Sentry.captureException(error)
    }
  }
}

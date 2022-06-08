import * as Sentry from '@sentry/node'
import { AnalyticsService } from 'analytics'
import { AnalyticsParams } from 'analytics/interfaces'
import { GoogleAuthorization } from 'authorization'
import { ChartBuilder } from 'chartBuilder'
import { AnalyticsError } from 'errors/types/AnalyticsError'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { MessengersParams, ParsedRange, RadiatorConfig, ScheduleConfig, SentryParams } from 'interfaces'
import { Lighthouse } from 'lighthouse'
import { LighthouseParams } from 'lighthouse/interfaces'
import { Logger } from 'logger'
import { MessengersService } from 'messengers'
import { RunCounter } from 'runCounter'
import { Scheduler } from 'scheduler'
import { SitemapOptions } from 'sitemap/interfaces/SitemapOptions'
import { GoogleDriveStorage } from 'storage'
import { parseRange } from 'utils/parseRange'

import { NewPagesInSite, PageAnalytics } from "./pagesAnalytics"
import { PagesParams } from "./pagesAnalytics/interfaces"
import { RedditCountPosts } from "./redditPosts"

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

  private runCounter: RunCounter

  private pageAnalytics: PageAnalytics | undefined

  private redditCountPosts: RedditCountPosts | undefined

  private newPagesInSite: NewPagesInSite | undefined

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range)
    this.messengersParams = { websiteUrl: config.websiteUrl }

    // instances
    this.googleAuthorization = new GoogleAuthorization(this.config)
    this.runCounter = new RunCounter()
  }

  public scheduleJob(scheduleParams: ScheduleConfig) {
    this.scheduler = new Scheduler(scheduleParams || ({} as ScheduleConfig))
    this.scheduler.scheduleJob(() => {
      this.runCounter.resetRunCounter()
      void this.run()
    })
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

    this.useChartBuilder(analyticsParams)
    this.useGoogleDriveStorage()
  }

  public useLighthouse(lighthouseParams: LighthouseParams) {
    this.lighthouse = new Lighthouse(
      {
        ...lighthouseParams,
        websiteUrl: this.config.websiteUrl,
        googleapisKey: this.config.googleapisKey,
      },
    )
  }

  public usePageAnalytics(sitemapParams: SitemapOptions) {
    this.pageAnalytics = new PageAnalytics({
      ...sitemapParams,
      websiteUrl: this.config.websiteUrl,
    })
  }

  public useRedditCountPosts() {
    this.redditCountPosts = new RedditCountPosts()
  }

  private useChartBuilder(analyticsParams: AnalyticsParams) {
    this.chartBuilder = new ChartBuilder(analyticsParams)
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

  public useNewPagesInSite(sitemap: PagesParams) {
    this.newPagesInSite = new NewPagesInSite({
      ...sitemap,
      websiteUrl: this.config.websiteUrl,
    })
  }

  private handleRadiatorError(error: Error | AnalyticsError | AuthorizationError) {
    Sentry.captureException(error)

    if (this.runCounter.getRunCounter() > this.config.retryAttempts) return

    if (error instanceof AuthorizationError || error instanceof AnalyticsError) {
      Logger.warning('Rerunning radiator...')
      void this.run()
    }
  }


  public async run() {
    try {
      let analytics
      let lighthouse
      let imageURL
      let pageAnalytics
      let imageBuffer
      let redditCountPosts
      let newPagesInSite

      this.runCounter.incrementRunCounter()

      if (this.sentryParams && this.sentryParams.sentryDSN) Radiator.sentryInit(this.sentryParams)

      Logger.info('Authorize with googleAuthorization...')
      const googleAuthorization = await this.googleAuthorization.authorize()

      if (this.analyticsService) {
        Logger.info('Getting analytics data...')
        try {
          analytics = await this.analyticsService.getData()
        } catch (error: any) {
          Logger.info(error)
        }
      }

      if (this.pageAnalytics) {
        Logger.info('Getting page analytics data...')
        pageAnalytics = await this.pageAnalytics.getPageAnalyticsMetrics()
      }

      if(this.redditCountPosts) {
        Logger.info('Getting reddit data...')
        redditCountPosts = await this.redditCountPosts.getPostsCountInReddit()
      }

      if (this.newPagesInSite) {
        Logger.info('Getting new pages data...')
        try {
          newPagesInSite = await this.newPagesInSite.setCountOfNewPages()
        } catch (error: any) {
          Logger.error(error.message)
        }
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
        // imageURL = imageBuffer && (await this.googleDriveStorage.storeFile(imageBuffer))
      }

      if (googleAuthorization && this.messengersParams) {
        Logger.info('Send messages...')
        const messengersService = new MessengersService(this.messengersParams)
        await messengersService.sendMessages({
          analytics,
          lighthouse,
          range: this.parsedRange,
          imageURL,
          redditCountPosts,
          newPagesInSite,
          pageAnalytics,
        })
        Logger.success('Success!')
      }

    } catch (error: any) {
      this.handleRadiatorError(error)
    }
  }
}

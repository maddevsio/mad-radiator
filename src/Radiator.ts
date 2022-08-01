import * as Sentry from '@sentry/node'
import { AnalyticsService } from 'analytics'
import { AnalyticsParams } from 'analytics/interfaces'
import { GoogleAuthorization } from 'authorization'
import { Enji } from 'enji'
import { AnalyticsError } from 'errors/types/AnalyticsError'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { GlassdoorService } from 'glassdoor'
import { GlassdoorParams } from 'glassdoor/interfaces/GlassdoorParams'
import { FirestoreConfig, MessengersParams, ParsedRange, RadiatorConfig, ScheduleConfig, SentryParams } from 'interfaces'
import { Lighthouse } from 'lighthouse'
import { LighthouseParams } from 'lighthouse/interfaces'
import { Logger } from 'logger'
import { MessengersService } from 'messengers'
import { QuoraService } from 'quora'
import { QuoraParams } from 'quora/interfaces'
import { IRedditParams } from 'redditPosts/interfaces'
import { RunCounter } from 'runCounter'
import { Scheduler } from 'scheduler'
import { SitemapOptions } from 'sitemap/interfaces/SitemapOptions'
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

  private scheduler: Scheduler | undefined

  private runCounter: RunCounter

  private pageAnalytics: PageAnalytics | undefined

  private redditCountPosts: RedditCountPosts | undefined

  private quoraPosts: QuoraService | undefined

  private glassdoorReviews: GlassdoorService | undefined

  private newPagesInSite: NewPagesInSite | undefined

  private enjiService: Enji | undefined

  constructor(config: RadiatorConfig) {
    this.config = config
    this.parsedRange = parseRange(this.config.range, this.config.nodeEnv)
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

    if (analyticsParams.totalUsersToEnji?.url) {
      this.enjiService = new Enji(analyticsParams.totalUsersToEnji.url)
    }
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

  public usePageAnalytics(sitemapParams: SitemapOptions, firestoreConfig: FirestoreConfig) {
    this.pageAnalytics = new PageAnalytics({
      ...sitemapParams,
      websiteUrl: this.config.websiteUrl,
    }, firestoreConfig)
  }

  public useRedditCountPosts(redditConfig: IRedditParams) {
    this.redditCountPosts = new RedditCountPosts(redditConfig)
  }

  public useQuoraService(quoraConfig: QuoraParams, firestoreConfig: FirestoreConfig) {
    this.quoraPosts = new QuoraService(quoraConfig, firestoreConfig)
  }

  public useGlassdoorService(glassdoorConfig: GlassdoorParams, firestoreConfig: FirestoreConfig) {
    this.glassdoorReviews = new GlassdoorService(glassdoorConfig, firestoreConfig)
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

  public useNewPagesInSite(sitemap: PagesParams, firestoreConfig: FirestoreConfig) {
    this.newPagesInSite = new NewPagesInSite({
      ...sitemap,
      websiteUrl: this.config.websiteUrl,
    }, firestoreConfig)
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
      let redditCountPosts
      let quoraPosts
      let newPagesInSite
      let glassdoorReviews

      this.runCounter.incrementRunCounter()

      if (this.sentryParams && this.sentryParams.sentryDSN) Radiator.sentryInit(this.sentryParams)

      Logger.info('Authorize with googleAuthorization...')
      const googleAuthorization = await this.googleAuthorization.authorize()

      if (this.analyticsService) {
        Logger.info('Getting analytics data...')
        try {
          analytics = await this.analyticsService.getData()
          if (this.enjiService) {
            await this.enjiService.sendTotalUsersToEnjiWithDate(Number(analytics.core.users.previous), this.parsedRange.analyticsDate)
          }
        } catch (error: any) {
          Logger.error(`Cannot get analytics data: ${error.message}.`)
        }
      }

      if (this.pageAnalytics) {
        Logger.info('Getting page analytics data...')
        pageAnalytics = await this.pageAnalytics.getPageAnalyticsMetrics()
      }

      if (this.redditCountPosts) {
        Logger.info('Getting reddit data...')
        redditCountPosts = await this.redditCountPosts.getPostsCountInReddit()
      }

      if (this.quoraPosts) {
        Logger.info('Getting quora data...')
        quoraPosts = await this.quoraPosts.setCountOfQuoraPosts()
      }

      if (this.glassdoorReviews) {
        Logger.info('Getting glassdoor data...')
        glassdoorReviews = await this.glassdoorReviews.setCountOfGlassdoorReviews()
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

      if (googleAuthorization && this.messengersParams) {
        Logger.info('Send messages...')
        const messengersService = new MessengersService(this.messengersParams)
        await messengersService.sendMessages({
          analytics,
          lighthouse,
          range: this.parsedRange,
          imageURL,
          redditCountPosts,
          quoraPosts,
          glassdoorReviews,
          newPagesInSite,
          pageAnalytics,
        })

        await googleAuthorization.unlink()
        Logger.success('Success!')
      }

    } catch (error: any) {
      this.handleRadiatorError(error)
    }
  }
}

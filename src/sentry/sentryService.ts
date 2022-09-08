import * as Sentry from '@sentry/node'
import { SentryParams } from 'interfaces'

export class SentryService {
  private readonly sentryConfig: SentryParams

  constructor(sentryConfig: SentryParams) {
    this.sentryConfig = sentryConfig
    this.sentryInit()
  }

  private sentryInit() {
    Sentry.init({
      dsn: this.sentryConfig.sentryDSN,
      tracesSampleRate: this.sentryConfig.tracesSampleRate,
    })
  }

  public sendErrorToSentry(error: any) {
    Sentry.captureException(error)
  }
}

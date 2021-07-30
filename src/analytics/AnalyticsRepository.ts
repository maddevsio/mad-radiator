import { analyticsreporting_v4, google } from 'googleapis'
import { ParsedRange, RadiatorConfig, Range } from 'interfaces'
import { AnalyticsDimension, AnalyticsMetric, AnalyticsPayload } from 'interfaces/analytics'

export abstract class AnalyticsRepository {
  private range: ParsedRange

  private googleAnalytics: analyticsreporting_v4.Analyticsreporting

  protected config: RadiatorConfig

  protected abstract metrics?: Array<AnalyticsMetric>

  protected abstract dimensions?: Array<AnalyticsDimension>

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
    this.googleAnalytics = google.analyticsreporting('v4')
  }

  protected async getAnalytics(
    metrics: Array<AnalyticsMetric> = [],
    dimensions: Array<AnalyticsDimension> = [],
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
}

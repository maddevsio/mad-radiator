import { analyticsreporting_v4, google } from 'googleapis'
import { ParsedRange, RadiatorConfig, Range } from 'interfaces'
import { AnalyticsDimension, AnalyticsMetric, AnalyticsPayload } from 'interfaces/analytics'

/**
 * Abstract Analytics repository
 */
export abstract class Repository {
  /**
   * Range for requests
   */
  private range: ParsedRange

  /**
   * GA instance
   */
  private googleAnalytics: analyticsreporting_v4.Analyticsreporting

  /**
   * Main radiator config
   */
  protected config: RadiatorConfig

  /**
   * GA metrics
   */
  protected abstract metrics?: Array<AnalyticsMetric>

  /**
   * GA dimensions
   */
  protected abstract dimensions?: Array<AnalyticsDimension>

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
    this.googleAnalytics = google.analyticsreporting('v4')
  }

  /**
   * Get analytics data
   */
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

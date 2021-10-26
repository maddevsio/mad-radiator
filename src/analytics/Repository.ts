import { AnalyticsDimension, AnalyticsMetric, AnalyticsParams, AnalyticsPayload } from 'analytics/interfaces'
import { analyticsreporting_v4, google } from 'googleapis'
import { ParsedRange, Range } from 'interfaces'

/**
 * Abstract Analytics repository
 */
export abstract class Repository {
  /**
   * Range for requests
   */
  private readonly range: ParsedRange

  /**
   * GA instance
   */
  private readonly googleAnalytics: analyticsreporting_v4.Analyticsreporting

  /**
   * Main radiator config
   */
  protected readonly config: AnalyticsParams

  /**
   * GA metrics
   */
  protected abstract readonly metrics?: Array<AnalyticsMetric>

  /**
   * GA dimensions
   */
  protected abstract readonly dimensions?: Array<AnalyticsDimension>

  constructor(config: AnalyticsParams, range: ParsedRange) {
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

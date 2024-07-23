import { AnalyticsDimension, AnalyticsMetric, AnalyticsParams } from 'analytics/interfaces'
import { AnalyticsError } from 'errors/types/AnalyticsError'
import { analyticsdata_v1beta, google } from 'googleapis'
import { ParsedRange, Range } from 'interfaces'

/**
 * Abstract Analytics repository
 */
export abstract class Repository {
  /**
   * Range for requests
   */
  readonly range: ParsedRange

  /**
   * GA instance
   */
  private readonly googleAnalytics: analyticsdata_v1beta.Analyticsdata

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
    this.googleAnalytics = google.analyticsdata('v1beta')
  }

  /**
   * Get analytics data
   */
  protected async getAnalytics(
    metrics: Array<AnalyticsMetric> = [],
    dimensions: Array<AnalyticsDimension> = [],
    dateRanges: Array<Range> = [this.range.originalRange, this.range.previousRange],
  ): Promise<any> {
    try {
      const response = await this.googleAnalytics.properties.runReport({
        property: `properties/${this.config.analyticsViewId}`,
        requestBody: {
          dateRanges,
          dimensions,
          metrics,
          metricAggregations: ['TOTAL', 'MAXIMUM', 'MINIMUM'],
        },
      })

      const payload = response?.data

      return payload
    } catch (error: any) {
      throw new AnalyticsError(error)
    }
  }
}

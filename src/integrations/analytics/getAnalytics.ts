import { google } from 'googleapis'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsDimension, AnalyticsMetric, AnalyticsPayload } from 'interfaces/analytics'

const googleAnalytics = google.analyticsreporting('v4')

export async function getAnalytics(
  metrics: Array<AnalyticsMetric>,
  dimensions: Array<AnalyticsDimension>,
  range: ParsedRange,
  config: RadiatorConfig,
): Promise<AnalyticsPayload> {
  const response = await googleAnalytics.reports.batchGet({
    // @ts-ignore
    requestBody: {
      reportRequests: [
        {
          viewId: config.analyticsViewId,
          dateRanges: [range.originalRange, range.previousRange],
          metrics,
          dimensions,
        },
      ],
    },
  })

  const payload = response.data.reports as AnalyticsPayload | undefined
  return payload || ([] as AnalyticsPayload)
}

import { Rate } from 'enums'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import {
  AnalyticsDimension,
  AnalyticsMetric,
  AnalyticsPayload,
  Country,
} from 'interfaces/analytics'
import { getPercentage } from 'utils/getPercentage'

const metrics: Array<AnalyticsMetric> = [{ expression: 'ga:users' }]

const dimensions: Array<AnalyticsDimension> = [{ name: 'ga:country' }]

function prettify(reports: AnalyticsPayload): Array<Country> {
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

export async function getCountriesData(
  range: ParsedRange,
  config: RadiatorConfig,
): Promise<Array<Country>> {
  const reports = await getAnalytics(metrics, dimensions, range, config)
  return prettify(reports)
}

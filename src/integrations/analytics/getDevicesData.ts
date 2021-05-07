import { Rate } from 'enums'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import {
  AnalyticsDimension,
  AnalyticsMetric,
  AnalyticsPayload,
  Device,
  DeviceTitle,
} from 'interfaces/analytics'
import { getPercentage } from 'utils/getPercentage'

const metrics: Array<AnalyticsMetric> = [{ expression: 'ga:users' }]

const dimensions: Array<AnalyticsDimension> = [{ name: 'ga:deviceCategory' }]

function prettify(reports: AnalyticsPayload): Array<Device> {
  const total: number = reports[0].data.totals[0].values[0]
  const totalPrev: number = reports[0].data.totals[1].values[0]

  return reports[0].data.rows
    .map(
      (row): Device => ({
        title: row.dimensions[0].toLowerCase() as DeviceTitle,
        value: getPercentage(Number(row.metrics[0].values[0]), total, false),
        previous: getPercentage(Number(row.metrics[1].values[0]), totalPrev, false),
      }),
    )
    .map(
      (device): Device => ({
        ...device,
        rate: device.value >= device.previous ? Rate.good : Rate.neutral,
      }),
    )
    .sort((a, b) => b.value - a.value)
}

export async function getDevicesData(
  range: ParsedRange,
  config: RadiatorConfig,
): Promise<Array<Device>> {
  const reports = await getAnalytics(metrics, dimensions, range, config)
  return prettify(reports)
}

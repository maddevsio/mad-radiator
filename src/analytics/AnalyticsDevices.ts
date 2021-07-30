import { AnalyticsRepository } from 'analytics/AnalyticsRepository'
import { Rate } from 'enums'
import { AnalyticsPayload, Device, DeviceTitle } from 'interfaces/analytics'
import { getPercentage } from 'utils/getPercentage'

export class AnalyticsDevices extends AnalyticsRepository {
  protected metrics = [{ expression: 'ga:users' }]

  protected dimensions = [{ name: 'ga:deviceCategory' }]

  public async getData() {
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return this.format(reports)
  }

  private format(reports: AnalyticsPayload): Array<Device> {
    const total = AnalyticsDevices.getTotal(reports, 0)
    const totalPrev = AnalyticsDevices.getTotal(reports, 1)

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

  private static getTotal(reports: AnalyticsPayload, key: 0 | 1): number {
    return reports[0].data.totals[key].values[0]
  }
}

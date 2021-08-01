import { Repository } from 'analytics/Repository'
import { AnalyticsPayload, Device, DeviceTitle } from 'analytics/interfaces'
import { Rate } from 'interfaces'

/**
 * Devices repository
 */
export class DevicesRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [{ expression: 'ga:users' }]

  /**
   * GA dimensions
   */
  dimensions = [{ name: 'ga:deviceCategory' }]

  /**
   * Get data from GA
   */
  public async getData() {
    const reports = await this.getAnalytics(this.metrics, this.dimensions)
    return DevicesRepository.format(reports)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload): Array<Device> {
    const total = DevicesRepository.getTotal(reports, 0)
    const totalPrev = DevicesRepository.getTotal(reports, 1)

    return reports[0].data.rows
      .map(
        (row): Device => ({
          title: row.dimensions[0].toLowerCase() as DeviceTitle,
          value: DevicesRepository.getPercentage(Number(row.metrics[0].values[0]), total),
          previous: DevicesRepository.getPercentage(Number(row.metrics[1].values[0]), totalPrev),
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

  /**
   * Get total from report
   */
  private static getTotal(reports: AnalyticsPayload, key: 0 | 1): number {
    return reports[0].data.totals[key].values[0]
  }

  /**
   * Get percentage for number from total
   */
  private static getPercentage(toCalculate: number, total: number): number {
    return Number(Number((toCalculate * 100) / total).toFixed(2))
  }
}

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
  metrics = [{ name: 'totalUsers' }]

  /**
   * GA dimensions
   */
  dimensions = [{ name: 'deviceCategory' }]

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

    return reports.rows
      .map(
        (row: { dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: number }> }): Device => ({
          title: row.dimensionValues[0].value.toLowerCase() as DeviceTitle,
          value: DevicesRepository.getPercentage(Number(row.metricValues[0]?.value), total),
          previous: DevicesRepository.getPercentage(Number(row.metricValues[1]?.value), totalPrev),
        }),
      )
      .map(
        (device: Device): Device => ({
          ...device,
          rate: device.value >= device.previous ? Rate.good : Rate.neutral,
        }),
      )
      .sort((a: Device, b: Device) => b.value - a.value)
  }

  /**
   * Get total from report
   */
  private static getTotal(reports: AnalyticsPayload, key: 0 | 1): number {
    return reports?.rows[key]?.metricValues[0].value
  }

  /**
   * Get percentage for number from total
   */
  private static getPercentage(toCalculate: number, total: number): number {
    return Number(Number((toCalculate * 100) / total).toFixed(2))
  }
}

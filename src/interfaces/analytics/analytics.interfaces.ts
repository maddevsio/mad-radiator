import { CoreItems } from 'interfaces/analytics/core.interfaces'
import { Country } from 'interfaces/analytics/countries.interfaces'
import { Device } from 'interfaces/analytics/devices.interfaces'
import { Goals } from 'interfaces/analytics/goals.interfaces'

export interface AnalyticsMetric {
  expression: string
}

export interface AnalyticsDimension {
  name: string
}

export interface AnalyticsValue {
  values: Array<number>
}

export interface AnalyticsDataRow {
  dimensions: Array<string>
  metrics: Array<AnalyticsValue>
}

export interface AnalyticsReport {
  data: {
    totals: Array<AnalyticsValue>
    rows: Array<AnalyticsDataRow>
  }
}

export type AnalyticsPayload = Array<AnalyticsReport>

export interface AnalyticsData {
  core: CoreItems
  countries: Array<Country>
  devices: Array<Device>
  goals: Goals
  chart: Record<string, number>
}

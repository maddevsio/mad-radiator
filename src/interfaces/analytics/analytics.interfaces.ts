import { CoreItems } from 'interfaces/analytics/core.interfaces'
import { Country } from 'interfaces/analytics/countries.interfaces'
import { Device } from 'interfaces/analytics/devices.interfaces'
import { Goals } from 'interfaces/analytics/goals.interfaces'

export type AnalyticsMetric = {
  expression: string
}

export type AnalyticsDimension = {
  name: string
}

export type AnalyticsValue = {
  values: Array<number>
}

export type AnalyticsDataRow = {
  dimensions: Array<string>
  metrics: Array<AnalyticsValue>
}

export type AnalyticsReport = {
  data: {
    totals: Array<AnalyticsValue>
    rows: Array<AnalyticsDataRow>
  }
}

export type AnalyticsPayload = Array<AnalyticsReport>

export type AnalyticsData = {
  core: CoreItems
  countries: Array<Country>
  devices: Array<Device>
  goals: Goals
}

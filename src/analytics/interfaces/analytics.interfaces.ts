import { Blog } from 'analytics/interfaces/blogs.interface'
import { CoreItems } from 'analytics/interfaces/core.interfaces'
import { Country } from 'analytics/interfaces/countries.interfaces'
import { Device } from 'analytics/interfaces/devices.interfaces'
import { Goals } from 'analytics/interfaces/goals.interfaces'

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
  chart?: Record<string, number>
  blogs?: Array<Blog>
}

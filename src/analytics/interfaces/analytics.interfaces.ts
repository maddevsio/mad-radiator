import { Blog } from 'analytics/interfaces/blogs.interface'
import { CoreItems } from 'analytics/interfaces/core.interfaces'
import { Country } from 'analytics/interfaces/countries.interfaces'
import { Device } from 'analytics/interfaces/devices.interfaces'
import { AnalyticsConversion, Goals } from 'analytics/interfaces/goals.interfaces'
import { ChartConfig } from 'interfaces'

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

export interface AnalyticsParams {
  analyticsViewId: string
  websiteUrl: string
  chart?: ChartConfig
  pagesPathForViewsAnalytics?: Array<string>
  analyticsConversions?: Array<AnalyticsConversion>
}

export type AnalyticsPayload = Array<AnalyticsReport>

export interface AnalyticsData {
  core: CoreItems
  countries: Array<Country>
  devices: Array<Device>
  goals: Goals
  chart?: Record<string, number>
  blogs: Array<Blog>
}

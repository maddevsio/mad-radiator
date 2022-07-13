import { Blog } from 'analytics/interfaces/blogs.interface'
import { CoreItems } from 'analytics/interfaces/core.interfaces'
import { Country } from 'analytics/interfaces/countries.interfaces'
// import { Device } from 'analytics/interfaces/devices.interfaces'
import { AnalyticsConversion } from 'analytics/interfaces/goals.interfaces'
import { ChartConfig } from 'interfaces'

import { ContactMe } from "./contactMe.interfaces"
import { EbookDownloads } from "./ebookDownloads.interfaces"
import { ISubscribers } from './subscribers.interface'

export interface AnalyticsMetric {
  name: string
}

export interface AnalyticsDimension {
  name: string
}

export interface AnalyticsValue {
  values: Array<number>
}

export type AnalyticDataRows = {
  dimensionValues: Array<{ value: string }>
  metricValues: Array<{ value: number }>
}

export interface AnalyticsPayload {
  dimensionHeaders: Array<{ name: string }>
  metricHeaders: Array<{ name: string }>
  rows: Array<AnalyticDataRows>
  rowCount: number
  metadata?: {
    currencyCode: string,
    timeZone: string
  }
  kind?: string
  totals: Array<AnalyticDataRows>
}

export interface AnalyticsParams {
  analyticsViewId: string
  websiteUrl: string
  chart?: ChartConfig
  pagesPathForViewsAnalytics?: Array<string>
  analyticsConversions?: Array<AnalyticsConversion>
}

export interface AnalyticsData {
  core: CoreItems
  countries: Array<Country>
  // devices: Array<Device>
  // goals: Goals
  chart?: Record<string, number>
  blogs: Array<Blog>
  contactMe: ContactMe
  ebookDownloads: Array<EbookDownloads>
  subscribers: ISubscribers
}

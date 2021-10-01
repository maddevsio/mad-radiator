import { AnalyticsConversion } from 'analytics/interfaces'
import {
  ChartConfig,
  EnvironmentConfig,
  LighthouseConfig,
  RangeType,
  ScheduleConfig,
} from 'interfaces'

export interface RadiatorConfig {
  env: EnvironmentConfig
  schedule?: ScheduleConfig
  chart?: ChartConfig
  lighthouse?: LighthouseConfig
  slack: boolean
  telegram: boolean
  range: RangeType
  slackChannelId: string
  telegramChannelId: number
  websiteUrl: string
  analyticsViewId: string
  analyticsConversions: Array<AnalyticsConversion>
  PagePathsListForAnalytics: Array<string>
}

import { RangeType, SchedulePeriod } from 'enums'
import { AnalyticsConversion } from 'interfaces/analytics'
import { emoji } from 'node-emoji'

export type Emoji = keyof typeof emoji

export interface Range {
  startDate: string
  endDate: string
}

export interface ParsedRange {
  range: RangeType
  originalRange: Range
  previousRange: Range
  text: string
}

export interface EnvironmentConfig {
  authType: string
  analyticsProjectId: string
  analyticsPrivateKeyId: string
  analyticsPrivateKey: string
  analyticsClientEmail: string
  analyticsClientId: string
  analyticsAuthUrl: string
  analyticsTokenUri: string
  analyticsProviderCertUrl: string
  analyticsClientCertUrl: string
  slackWebhookUrl: string
  googleapisKey: string
  telegramToken: string
}

export interface ScheduleConfig {
  period: SchedulePeriod
  cron?: string
  time?: number // hour of days in UTC(0-23)
  weekDay?: number // 0-7 (0 or 7 is Sun)
  monthDay?: number // 1-31
}

export interface RadiatorConfig {
  env: EnvironmentConfig
  schedule?: ScheduleConfig
  slack: boolean
  telegram: boolean
  range: RangeType
  slackChannelId: string
  telegramChannelId: number
  websiteUrl: string
  analyticsViewId: string
  analyticsConversions: Array<AnalyticsConversion>
}

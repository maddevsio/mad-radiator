import { RangeType } from 'enums'

export type Range = {
  startDate: string
  endDate: string
}

export type ParsedRange = {
  range: RangeType
  originalRange: Range
  previousRange: Range
  text: string
}

export type EnvironmentConfig = {
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

export type RadiatorConfig = {
  env: EnvironmentConfig
  slack: boolean
  telegram: boolean
  range: RangeType
  slackChannelId: string
  telegramChannelId: number
  websiteUrl: string
  analyticsViewId: string
}

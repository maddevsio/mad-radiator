import { RangeType, SchedulePeriod } from 'enums'
import { RadiatorConfig } from 'interfaces'

export const defaultConfig: RadiatorConfig = {
  env: {
    authType: '',
    analyticsProjectId: '',
    analyticsPrivateKeyId: '',
    analyticsPrivateKey: '',
    analyticsClientEmail: '',
    analyticsClientId: '',
    analyticsAuthUrl: '',
    analyticsTokenUri: '',
    analyticsProviderCertUrl: '',
    analyticsClientCertUrl: '',
    slackWebhookUrl: '',
    googleapisKey: '',
    telegramToken: '',
  },
  slack: true,
  telegram: true,
  range: RangeType.day,
  slackChannelId: '123',
  telegramChannelId: 1,
  websiteUrl: '',
  analyticsViewId: '2',
  analyticsConversions: [
    {
      name: 'Leads',
      emoji: 'zap',
      goals: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      name: 'Contacts',
      emoji: 'telephone_receiver',
      goals: [10, 11, 12, 13, 14, 15],
    },
    {
      name: 'Careers',
      emoji: 'briefcase',
      goals: [9],
    },
  ],
  schedule: {
    cron: '* * * * *',
    period: SchedulePeriod.day,
    time: 10,
  },
}
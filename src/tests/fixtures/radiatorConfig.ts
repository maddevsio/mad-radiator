import { RangeType } from 'enums'
import { RadiatorConfig } from 'interfaces'

const radiatorConfigFixture: RadiatorConfig = {
  env: {
    authType: '123',
    analyticsProjectId: '123',
    analyticsPrivateKeyId: '123',
    analyticsPrivateKey: '123',
    analyticsClientEmail: '123',
    analyticsClientId: '123',
    analyticsAuthUrl: '123',
    analyticsTokenUri: '123',
    analyticsProviderCertUrl: '123',
    analyticsClientCertUrl: '123',
    slackWebhookUrl: '123',
    googleapisKey: '123',
    telegramToken: '123',
  },
  slack: true,
  telegram: true,
  range: RangeType.day,
  slackChannelId: 'string',
  telegramChannelId: 1,
  websiteUrl: 'http://example.com',
  analyticsViewId: '12345',
}

export default radiatorConfigFixture

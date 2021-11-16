import { RangeType } from 'interfaces'

export interface RadiatorConfig {
  authType: string,
  analyticsProjectId: string
  analyticsPrivateKeyId: string
  analyticsPrivateKey: string,
  analyticsClientEmail: string,
  analyticsClientId: string,
  analyticsAuthUrl: string,
  analyticsTokenUri: string,
  analyticsProviderCertUrl: string,
  analyticsClientCertUrl: string,
  googleapisKey: string,
  websiteUrl: string,
  range: RangeType
  retryAttempts: number
}

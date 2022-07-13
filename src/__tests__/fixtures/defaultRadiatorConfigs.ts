import { RadiatorConfig, RangeType } from 'interfaces'

export const defaultConfig: RadiatorConfig = {
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
  googleapisKey: '',
  websiteUrl: '',
  expiryDate: 0,
  tokenType: '',
  idToken: '',
  range: RangeType.day,
  retryAttempts: 2
}

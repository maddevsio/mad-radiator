import { RadiatorConfig, RangeType } from 'interfaces'

export const defaultConfig: RadiatorConfig = {
  clientId: '',
  clientSecret: '',
  redirectUri:'',
  accessToken: '',
  refreshToken: '',
  googleapisKey: '',
  websiteUrl: '',
  range: RangeType.day,
  retryAttempts: 2
}

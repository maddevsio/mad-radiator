import { RadiatorConfig, RangeType } from 'interfaces'

export const defaultConfig: RadiatorConfig = {
  clientId: '',
  clientSecret: '',
  redirectUri:'',
  accessToken: '',
  refreshToken: '',
  googleapisKey: '',
  websiteUrl: '',
  sitemapUrl: 'sitemap.xml',
  expiryDate: 0,
  tokenType: '',
  idToken:'',
  range: RangeType.day,
  retryAttempts: 2
}

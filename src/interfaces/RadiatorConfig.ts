import { RangeType } from 'interfaces'

export interface RadiatorConfig {
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  accessToken: string,
  refreshToken: string,
  googleapisKey: string,
  expiryDate?: number,
  tokenType?: string,
  id_token?:string,
  websiteUrl: string,
  range: RangeType | string,
  retryAttempts: number
}

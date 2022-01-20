import { RangeType } from 'interfaces'

export interface RadiatorConfig {
  googleapisKey: string,
  websiteUrl: string,
  range: RangeType | string,
  retryAttempts: number
}

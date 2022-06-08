import { AnalyticsData } from 'analytics/interfaces'
import { ParsedRange } from 'interfaces'
import { LighthouseData } from 'lighthouse/interfaces'

export interface BuildMessageData {
  analytics?: AnalyticsData
  range: ParsedRange
  lighthouse?: LighthouseData
  imageURL?: string
  redditCountPosts?: number
  newPagesInSite?: number
}

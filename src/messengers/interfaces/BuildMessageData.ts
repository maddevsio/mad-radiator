import { AnalyticsData } from 'analytics/interfaces'
import { ParsedRange } from 'interfaces'
import { LighthouseData } from 'lighthouse/interfaces'
import { PageAnalyticsData } from "pagesAnalytics/interfaces"

export interface BuildMessageData {
  analytics?: AnalyticsData
  range: ParsedRange
  lighthouse?: LighthouseData
  imageURL?: string
  pageAnalytics?: PageAnalyticsData | null
  redditCountPosts?: number
}

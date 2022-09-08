import { AnalyticsData } from 'analytics/interfaces'
import { ParsedRange } from 'interfaces'
import { PageAnalyticsData } from "pagesAnalytics/interfaces"

import { ISearchConsoleData } from '../../searchConsole/interfaces'

export interface BuildMessageDataSpec {
  analytics?: AnalyticsData
  range?: ParsedRange
  pageAnalytics?: PageAnalyticsData | null
  redditCountPosts?: number
  quoraPosts?: number
  glassdoorReviews?: number
  newPagesInSite?: number
  searchConsole?: ISearchConsoleData
}

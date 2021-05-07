import { Rate } from 'enums'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsMetric, AnalyticsPayload, CoreItems } from 'interfaces/analytics'
import { formatTime } from 'utils/formatTime'
import { getPercentage } from 'utils/getPercentage'

const metrics: Array<AnalyticsMetric> = [
  { expression: 'ga:users' },
  { expression: 'ga:sessions' },
  { expression: 'ga:bounceRate' },
  { expression: 'ga:avgSessionDuration' },
]

function prettify(reports: AnalyticsPayload): CoreItems {
  const [users, sessions, bounceRate, duration] = reports[0].data.totals[0].values.map(n =>
    Number(Number(n).toFixed(2)),
  )
  const [
    usersPrev,
    sessionsPrev,
    bounceRatePrev,
    durationPrev,
  ] = reports[0].data.totals[1].values.map(n => Number(Number(n).toFixed(2)))

  const usersDifference = getPercentage(users, usersPrev)
  const sessionsDifference = getPercentage(sessions, sessionsPrev)
  const bounceRateDifference = getPercentage(bounceRate, bounceRatePrev)
  const durationDifference = getPercentage(duration, durationPrev)

  return {
    users: {
      value: users,
      previous: usersPrev,
      difference: String(usersDifference > 0 ? `+${usersDifference}` : usersDifference),
      rate: usersDifference > 0 ? Rate.good : Rate.bad,
    },
    sessions: {
      value: sessions,
      previous: sessionsPrev,
      difference: String(sessionsDifference > 0 ? `+${sessionsDifference}` : sessionsDifference),
      rate: sessionsDifference > 0 ? Rate.good : Rate.bad,
    },
    bounceRate: {
      value: bounceRate,
      previous: bounceRatePrev,
      difference: String(
        bounceRateDifference > 0 ? `+${bounceRateDifference}` : bounceRateDifference,
      ),
      rate: bounceRateDifference < 0 ? Rate.good : Rate.bad,
    },
    duration: {
      value: formatTime(duration),
      previous: formatTime(durationPrev),
      difference: String(durationDifference > 0 ? `+${durationDifference}` : durationDifference),
      rate: durationDifference > 0 ? Rate.good : Rate.bad,
    },
  }
}

export async function getCoreData(range: ParsedRange, config: RadiatorConfig): Promise<CoreItems> {
  const reports: AnalyticsPayload = await getAnalytics(metrics, [], range, config)
  return prettify(reports)
}

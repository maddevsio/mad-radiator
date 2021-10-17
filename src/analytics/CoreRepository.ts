import { Repository } from 'analytics/Repository'
import { AnalyticsPayload, CoreItems } from 'analytics/interfaces'
import { Rate } from 'interfaces'
import { formatTime } from 'utils/formatTime'

/**
 * Core repository
 */
export class CoreRepository extends Repository {
  /**
   * GA metrics
   */
  metrics = [
    { expression: 'ga:users' },
    { expression: 'ga:sessions' },
    { expression: 'ga:bounceRate' },
    { expression: 'ga:avgSessionDuration' },
  ]

  /**
   * GA dimensions
   * not needed for core data
   */
  dimensions = undefined

  /**
   * Get data from GA
   */
  public async getData(): Promise<CoreItems> {
    const reports: AnalyticsPayload = await this.getAnalytics(this.metrics)
    return CoreRepository.format(reports)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload): CoreItems {
    const [users, sessions, bounceRate, duration] = reports[0].data.totals[0].values.map(n =>
      Number(Number(n).toFixed(2)),
    )
    const [usersPrev, sessionsPrev, bounceRatePrev, durationPrev] =
      reports[0].data.totals[1].values.map(n => Number(Number(n).toFixed(2)))

    const usersDifference = CoreRepository.getPercentage(users, usersPrev)
    const sessionsDifference = CoreRepository.getPercentage(sessions, sessionsPrev)
    const bounceRateDifference = CoreRepository.getPercentage(bounceRate, bounceRatePrev)
    const durationDifference = CoreRepository.getPercentage(duration, durationPrev)

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

  /**
   * Get percentage between two numbers
   */
  private static getPercentage(first: number, second: number): number {
    return Number(Number(((first - second) / ((first + second) / 2)) * 100).toFixed(2))
  }
}

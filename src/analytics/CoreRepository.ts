import { Repository } from 'analytics/Repository'
import { AnalyticDataRows, AnalyticsPayload, CoreItems } from 'analytics/interfaces'
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
    { name: 'totalUsers' },
    { name: 'active7DayUsers' },
    { name: 'active28DayUsers' },
    { name: 'sessions' },
    { name: 'bounceRate' },
    { name: 'averageSessionDuration' }
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
    let reports

    try {
      reports = await this.getAnalytics(this.metrics)
    } catch (error: any) {
      throw new Error(error)
    }

    return CoreRepository.format(reports)
  }

  /**
   * Format raw GA data
   */
  private static format(reports: AnalyticsPayload): CoreItems {
    const currentReport = {
      rows: reports.rows
        .filter((row: AnalyticDataRows) => row.dimensionValues[0].value === 'date_range_0'),
    }

    const previousReport = {
      rows: reports.rows
        .filter((row: AnalyticDataRows) => row.dimensionValues[0].value === 'date_range_1'),
    }

    const [
      users,
      usersForWeek,
      usersForMonth,
      sessions,
      bounceRate,
      duration,
    ] = currentReport.rows[0].metricValues
      .map((n: { value: number }) => Number(Number(n.value).toFixed(2)))

    const [
      usersPrev,
      usersForWeekPrev,
      usersForMonthPrev,
      sessionsPrev,
      bounceRatePrev,
      durationPrev,
    ] = previousReport.rows[0].metricValues
      .map((n: { value: number }) => Number(Number(n.value).toFixed(2)))

    const usersDifference = CoreRepository.getPercentage(users, usersPrev)
    const sessionsDifference = CoreRepository.getPercentage(sessions, sessionsPrev)
    const bounceRateDifference = CoreRepository.getPercentage(bounceRate, bounceRatePrev)
    const durationDifference = CoreRepository.getPercentage(duration, durationPrev)
    CoreRepository.getPercentage(usersForMonthPrev, usersForWeekPrev) // refactor this, need delete

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
      weeklyUsers: {
        value: usersForWeek,
      },
      monthlyUsers: {
        value: usersForMonth,
      }
    }
  }

  /**
   * Get percentage between two numbers
   */
  private static getPercentage(first: number, second: number): number {
    if (first > second) return Number(Number((first - second) / first * 100).toFixed(2))
    return Number(Number((first - second) / second * 100).toFixed(2))
  }
}

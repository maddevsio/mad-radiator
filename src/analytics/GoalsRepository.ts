import { Repository } from 'analytics/Repository'
import { Rate } from 'enums'
import { AnalyticsConversion, AnalyticsMetric, AnalyticsPayload, Goals } from 'interfaces/analytics'

export interface ComputedGoal {
  payload: AnalyticsPayload
  conversion: AnalyticsConversion
}

/**
 * Goals repository
 */
export class GoalsRepository extends Repository {
  /**
   * GA metrics
   * not needed for goals data
   */
  metrics = undefined

  /**
   * GA dimensions
   * not needed for goals data
   */
  dimensions = undefined

  /**
   * Get data from GA
   */
  public async getData(): Promise<Goals> {
    const { analyticsConversions } = this.config
    const goals = await Promise.all(
      analyticsConversions.map(async conversion => this.getConversion(conversion)),
    )
    return GoalsRepository.format(goals)
  }

  /**
   * Get conversions from GA
   */
  private async getConversion(conversion: AnalyticsConversion): Promise<ComputedGoal> {
    const payload = await this.getAnalytics(
      GoalsRepository.transformGoalsToMetrics(conversion.goals),
    )
    return {
      payload,
      conversion,
    }
  }

  /**
   * Format raw GA data
   */
  private static format(goals: Array<ComputedGoal>): Goals {
    return goals.map(goal => {
      const { value, previous } = GoalsRepository.calculateValue(goal.payload)
      const rate = value > previous ? Rate.good : Rate.bad

      return {
        name: goal.conversion.name,
        emoji: goal.conversion.emoji,
        value,
        previous,
        rate,
      }
    })
  }

  /**
   * Transform goals from config to a correct GA metrics
   */
  private static transformGoalsToMetrics(goals: Array<Number>): Array<AnalyticsMetric> {
    return goals.map(goal => ({
      expression: `ga:goal${goal}Completions`,
    }))
  }

  /**
   * Calculate current and previous values
   */
  private static calculateValue(entity: AnalyticsPayload) {
    return {
      value:
        entity[0] && entity[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
      previous:
        entity[0] && entity[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
    }
  }
}

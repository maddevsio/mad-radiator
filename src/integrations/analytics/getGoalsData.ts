import { Rate } from 'enums'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsConversion, AnalyticsMetric, AnalyticsPayload, Goals } from 'interfaces/analytics'

// const LEADS_GOALS = [1, 2, 3, 4, 5, 6, 7, 8]
// const CAREER_GOALS = [9]
// const CONTACT_GOALS = [10, 11, 12, 13, 14, 15]

const transformGoalsToMetrics = (goals: Array<Number>): Array<AnalyticsMetric> =>
  goals.map(goal => ({
    expression: `ga:goal${goal}Completions`,
  }))

const calculateValue = (entity: AnalyticsPayload) => ({
  value: entity[0] && entity[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
  previous:
    entity[0] && entity[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
})

function prettify(
  rawGoals: Array<{ data: AnalyticsPayload; conversion: AnalyticsConversion }>,
): Goals {
  return rawGoals.map(goal => {
    const { value, previous } = calculateValue(goal.data)
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

export async function getGoalsData(range: ParsedRange, config: RadiatorConfig): Promise<Goals> {
  const rawGoals = await Promise.all(
    config.analyticsConversions.map(async conversion => {
      const data = await getAnalytics(transformGoalsToMetrics(conversion.goals), [], range, config)
      return {
        data,
        conversion,
      }
    }),
  )

  return prettify(rawGoals)
}

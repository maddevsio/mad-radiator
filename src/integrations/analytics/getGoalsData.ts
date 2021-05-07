import { Rate } from 'enums'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsMetric, AnalyticsPayload, Goals } from 'interfaces/analytics'

const LEADS_GOALS = [1, 2, 3, 4, 5, 6, 7, 8]
const CAREER_GOALS = [9]
const CONTACT_GOALS = [10, 11, 12, 13, 14, 15]

const leadsMetrics: Array<AnalyticsMetric> = LEADS_GOALS.map(id => ({
  expression: `ga:goal${id}Completions`,
}))

const careerMetrics: Array<AnalyticsMetric> = CAREER_GOALS.map(id => ({
  expression: `ga:goal${id}Completions`,
}))

const contactMetrics: Array<AnalyticsMetric> = CONTACT_GOALS.map(id => ({
  expression: `ga:goal${id}Completions`,
}))

function prettify(
  leads: AnalyticsPayload,
  careers: AnalyticsPayload,
  contacts: AnalyticsPayload,
): Goals {

  const goals: Goals = {
    leads: {
      value:
        leads[0] && leads[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
      previous:
        leads[0] && leads[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
    },
    career: {
      value:
        careers[0] && careers[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
      previous:
        careers[0] && careers[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
    },
    contacts: {
      value:
        contacts[0] &&
        contacts[0].data.totals[0].values.reduce((acc, curr) => acc + Number(curr), 0),
      previous:
        contacts[0] &&
        contacts[0].data.totals[1].values.reduce((acc, curr) => acc + Number(curr), 0),
    },
  }

  goals.leads.rate = goals.leads.value > goals.leads.previous ? Rate.good : Rate.bad
  goals.career.rate = goals.career.value > goals.career.previous ? Rate.good : Rate.bad
  goals.contacts.rate = goals.contacts.value > goals.contacts.previous ? Rate.good : Rate.bad

  return goals
}

export async function getGoalsData(range: ParsedRange, config: RadiatorConfig): Promise<Goals> {
  const leads = await getAnalytics(leadsMetrics, [], range, config)
  const careers = await getAnalytics(careerMetrics, [], range, config)
  const contacts = await getAnalytics(contactMetrics, [], range, config)
  return prettify(leads, careers, contacts)
}

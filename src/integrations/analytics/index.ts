import { authorize } from 'integrations/analytics/auth'
import { getCoreData } from 'integrations/analytics/getCoreData'
import { getCountriesData } from 'integrations/analytics/getCountriesData'
import { getDevicesData } from 'integrations/analytics/getDevicesData'
import { getGoalsData } from 'integrations/analytics/getGoalsData'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'

export default async function main(
  range: ParsedRange,
  config: RadiatorConfig,
): Promise<AnalyticsData> {
  const finish = await authorize(config)

  const core = await getCoreData(range, config)
  const countries = await getCountriesData(range, config)
  const devices = await getDevicesData(range, config)
  const goals = await getGoalsData(range, config)

  const data: AnalyticsData = {
    core,
    countries,
    devices,
    goals,
  }

  await finish()

  return data
}

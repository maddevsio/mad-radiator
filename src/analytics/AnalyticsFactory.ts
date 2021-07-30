import { AnalyticsChart } from 'analytics/AnalyticsChart'
import { AnalyticsCore } from 'analytics/AnalyticsCore'
import { AnalyticsCountries } from 'analytics/AnalyticsCountries'
import { AnalyticsDevices } from 'analytics/AnalyticsDevices'
import { AnalyticsGoals } from 'analytics/AnalyticsGoals'
import { ParsedRange, RadiatorConfig } from 'interfaces'

export enum RepositoryTypes {
  core = 'core',
  countries = 'countries',
  goals = 'goals',
  devices = 'devices',
  chart = 'chart',
}

export type AnalyticsRepositoryType =
  | AnalyticsCountries
  | AnalyticsGoals
  | AnalyticsChart
  | AnalyticsDevices
  | AnalyticsCore

export class AnalyticsFactory {
  createRepository<T extends AnalyticsRepositoryType>(
    type: RepositoryTypes,
    config: RadiatorConfig,
    range: ParsedRange,
  ): T {
    switch (type) {
      case RepositoryTypes.countries:
        return new AnalyticsCountries(config, range)
      case RepositoryTypes.goals:
        return new AnalyticsGoals(config, range)
      case RepositoryTypes.devices:
        return new AnalyticsDevices(config, range)
      case RepositoryTypes.chart:
        return new AnalyticsChart(config, range)
      default:
        return new AnalyticsCore(config, range)
    }
  }
}

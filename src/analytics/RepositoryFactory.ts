import { ChartRepository } from 'analytics/ChartRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { DevicesRepository } from 'analytics/DevicesRepository'
import { GoalsRepository } from 'analytics/GoalsRepository'
import { ParsedRange, RadiatorConfig } from 'interfaces'

export enum RepositoryTypes {
  core = 'core',
  countries = 'countries',
  goals = 'goals',
  devices = 'devices',
  chart = 'chart',
}

export type RepositoryType =
  | CountriesRepository
  | GoalsRepository
  | ChartRepository
  | DevicesRepository
  | CoreRepository

/**
 * Factory for Analytics repositories
 */
export class RepositoryFactory {
  /**
   * Create some repository from type
   */
  createRepository(
    type: RepositoryTypes,
    config: RadiatorConfig,
    range: ParsedRange,
  ): RepositoryType {
    switch (type) {
      case RepositoryTypes.countries:
        return new CountriesRepository(config, range)
      case RepositoryTypes.goals:
        return new GoalsRepository(config, range)
      case RepositoryTypes.devices:
        return new DevicesRepository(config, range)
      case RepositoryTypes.chart:
        return new ChartRepository(config, range)
      default:
        return new CoreRepository(config, range)
    }
  }
}

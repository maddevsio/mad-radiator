import { BlogsRepository } from 'analytics/BlogsRepository'
import { ChartRepository } from 'analytics/ChartRepository'
import { ContactMeRepository } from 'analytics/ContactMeRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
// import { DevicesRepository } from 'analytics/DevicesRepository'
// import { GoalsRepository } from 'analytics/GoalsRepository'
import { SubscribersRepository } from 'analytics/SubscribersRepository'
import { ParsedRange } from 'interfaces'

import { AnalyticsParams } from './interfaces'


export enum RepositoryTypes {
  core = 'core',
  countries = 'countries',
  // goals = 'goals',
  // devices = 'devices',
  blogs = 'blogs',
  contactMe = 'contactMe',
  subscribers = 'subscribers',
}

export type RepositoryType =
  | CountriesRepository
  // | GoalsRepository
  | ChartRepository
  // | DevicesRepository
  | CoreRepository
  | BlogsRepository
  | ContactMeRepository
  | SubscribersRepository

/**
 * Factory for Analytics repositories
 */
export class RepositoryFactory {
  /**
   * Create some repository from type
   */
  createRepository(
    type: RepositoryTypes,
    config: AnalyticsParams,
    range: ParsedRange,
  ): RepositoryType {
    switch (type) {
      case RepositoryTypes.countries:
        return new CountriesRepository(config, range)
      // case RepositoryTypes.goals:
      //   return new GoalsRepository(config, range)
      // case RepositoryTypes.devices:
      //   return new DevicesRepository(config, range)
      case RepositoryTypes.blogs:
        return new BlogsRepository(config, range)
      case RepositoryTypes.contactMe:
        return new ContactMeRepository(config, range)
      case RepositoryTypes.subscribers:
        return new SubscribersRepository(config, range)
      default:
        return new CoreRepository(config, range)
    }
  }
}

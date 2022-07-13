import { BlogsRepository } from 'analytics/BlogsRepository'
import { ChartRepository } from 'analytics/ChartRepository'
import { ContactMeRepository } from 'analytics/ContactMeRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { EbookDownloadsRepository } from 'analytics/EbookDownloadsRepository'
// import { DevicesRepository } from 'analytics/DevicesRepository'
// import { GoalsRepository } from 'analytics/GoalsRepository'
import { ParsedRange } from 'interfaces'

import { AnalyticsParams } from './interfaces'


export enum RepositoryTypes {
  core = 'core',
  countries = 'countries',
  // goals = 'goals',
  // devices = 'devices',
  chart = 'chart',
  blogs = 'blogs',
  contactMe = 'contactMe',
  ebookDownloads = 'ebookDownloads'
}

export type RepositoryType =
  | CountriesRepository
  // | GoalsRepository
  | ChartRepository
  // | DevicesRepository
  | CoreRepository
  | BlogsRepository
  | ContactMeRepository
  | EbookDownloadsRepository

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
      case RepositoryTypes.chart:
        return new ChartRepository(config, range)
      case RepositoryTypes.blogs:
        return new BlogsRepository(config, range)
      case RepositoryTypes.contactMe:
        return new ContactMeRepository(config, range)
      case RepositoryTypes.ebookDownloads:
        return new EbookDownloadsRepository(config, range)
      default:
        return new CoreRepository(config, range)
    }
  }
}

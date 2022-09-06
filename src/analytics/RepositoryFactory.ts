import { BlogsRepository } from 'analytics/BlogsRepository'
import { ContactMeRepository } from 'analytics/ContactMeRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { EbookDownloadsRepository } from 'analytics/EbookDownloadsRepository'
import { SubscribersRepository } from 'analytics/SubscribersRepository'
import { ParsedRange } from 'interfaces'

import { AnalyticsParams } from './interfaces'


export enum RepositoryTypes {
  core = 'core',
  countries = 'countries',
  blogs = 'blogs',
  subscribers = 'subscribers',
  contactMe = 'contactMe',
  ebookDownloads = 'ebookDownloads'
}

export type RepositoryType =
  | CountriesRepository
  | CoreRepository
  | BlogsRepository
  | ContactMeRepository
  | SubscribersRepository
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
      case RepositoryTypes.blogs:
        return new BlogsRepository(config, range)
      case RepositoryTypes.contactMe:
        return new ContactMeRepository(config, range)
      case RepositoryTypes.subscribers:
        return new SubscribersRepository(config, range)
      case RepositoryTypes.ebookDownloads:
        return new EbookDownloadsRepository(config, range)
      default:
        return new CoreRepository(config, range)
    }
  }
}

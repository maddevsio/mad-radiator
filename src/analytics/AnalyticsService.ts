import { RepositoryFactory, RepositoryType, RepositoryTypes } from 'analytics/RepositoryFactory'
import { AnalyticsData, AnalyticsParams, Blog, ContactMe, CoreItems, Country, EbookDownloads, ISubscribers } from 'analytics/interfaces'
import { AnalyticsError } from 'errors/types/AnalyticsError'
import { ParsedRange } from 'interfaces'

// import { Blog } from './interfaces'

/**
 * Analytics service
 */
export class AnalyticsService {
  /**
   * Range for requests
   */
  private range: ParsedRange

  /**
   * Main radiator config
   */
  protected config: AnalyticsParams

  /**
   * Repositories factory
   */
  private factory: RepositoryFactory

  /**
   * All Repositories
   */
  private repositories: Record<RepositoryTypes, RepositoryType>

  constructor(config: AnalyticsParams, range: ParsedRange) {
    this.config = config
    this.range = range
    this.factory = new RepositoryFactory()
    this.repositories = this.createRepositories()
  }

  /**
   * Get all GA data
   */
  public async getData(): Promise<AnalyticsData> {
    try {
      // TODO: Fix "as"
      const core = (await this.repositories.core.getData()) as CoreItems

      const countries = (await this.repositories.countries.getData()) as Array<Country>
      const blogs = (await this.repositories.blogs.getData()) as Array<Blog>
      const contactMe = (await this.repositories.contactMe.getData()) as ContactMe
      const subscribers = (await this.repositories.subscribers.getData()) as ISubscribers
      const ebookDownloads = (await this.repositories.ebookDownloads.getData()) as Array<EbookDownloads>
      return {
        core,
        countries,
        // chart,
        blogs,
        contactMe,
        subscribers,
        ebookDownloads,
      }
    } catch (error: any) {
      throw new AnalyticsError(error)
    }
  }

  /**
   * Create repositories
   */
  private createRepositories() {
    return {
      core: this.factory.createRepository(RepositoryTypes.core, this.config, this.range),
      countries: this.factory.createRepository(RepositoryTypes.countries, this.config, this.range),
      // devices: this.factory.createRepository(RepositoryTypes.devices, this.config, this.range),
      // goals: this.factory.createRepository(RepositoryTypes.goals, this.config, this.range),
      blogs: this.factory.createRepository(RepositoryTypes.blogs, this.config, this.range),
      contactMe: this.factory.createRepository(RepositoryTypes.contactMe, this.config, this.range),
      subscribers: this.factory.createRepository(RepositoryTypes.subscribers, this.config, this.range),
      ebookDownloads: this.factory.createRepository(RepositoryTypes.ebookDownloads, this.config, this.range),
    }
  }
}

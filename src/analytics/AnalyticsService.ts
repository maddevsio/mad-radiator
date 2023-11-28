/* eslint-disable @typescript-eslint/no-unused-expressions */
import { RepositoryFactory, RepositoryType, RepositoryTypes } from 'analytics/RepositoryFactory'
import {
  AnalyticsData,
  AnalyticsParams,
  Blog,
  ContactMe,
  CoreItems,
  Country,
  EbookDownloads,
  ISubscribers,
  Page,
} from 'analytics/interfaces'
import { AnalyticsError } from 'errors/types/AnalyticsError'
import { ParsedRange } from 'interfaces'

import { EnjiService } from '../enji'
import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'
import { parseRange } from '../utils/parseRange'

export class AnalyticsService implements RadiatorService {
  protected config: AnalyticsParams

  private readonly range: ParsedRange

  private factory: RepositoryFactory

  private repositories: Record<RepositoryTypes, RepositoryType>

  constructor(config: AnalyticsParams, range: string) {
    this.config = config
    this.range = parseRange(range)
    this.factory = new RepositoryFactory()
    this.repositories = this.createRepositories()
  }

  async perform(results: BuildMessageDataSpec, radiator: RadiatorSpec): Promise<BuildMessageDataSpec> {
    return Object.assign(
      results,
      radiator.authorized
        ? {
          analytics: await executeWithRetry(
            `${this.getName()}.getData()`, 5, 1500,
            () => this.getData(),
            (error: any) => error instanceof AnalyticsError),
        }
        : {},
    )
  }

  public getName(): string {
    return this.constructor.name
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
      const pages = (await this.repositories.pages.getData()) as Array<Page>
      const contactMe = (await this.repositories.contactMe.getData()) as ContactMe
      const subscribers = (await this.repositories.subscribers.getData()) as ISubscribers
      const ebookDownloads = (await this.repositories.ebookDownloads.getData()) as Array<EbookDownloads>

      this.config.totalUsersToEnji?.url && await new EnjiService(this.config.totalUsersToEnji?.url)
        .sendTotalUsersToEnjiWithDate(Number(core.users.previous))

      return {
        core,
        countries,
        // chart,
        blogs,
        pages,
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
      pages: this.factory.createRepository(RepositoryTypes.pages, this.config, this.range),
      contactMe: this.factory.createRepository(RepositoryTypes.contactMe, this.config, this.range),
      subscribers: this.factory.createRepository(RepositoryTypes.subscribers, this.config, this.range),
      ebookDownloads: this.factory.createRepository(RepositoryTypes.ebookDownloads, this.config, this.range),
    }
  }
}

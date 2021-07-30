import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData, CoreItems, Country, Device, Goals } from 'interfaces/analytics'

import { RepositoryFactory, RepositoryType, RepositoryTypes } from './RepositoryFactory'

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
  protected config: RadiatorConfig

  /**
   * Repositories factory
   */
  private factory: RepositoryFactory

  /**
   * All Repositories
   */
  private repositories: Record<RepositoryTypes, RepositoryType>

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
    this.factory = new RepositoryFactory()
    this.repositories = this.createRepositories()
  }

  /**
   * Get all GA data
   */
  public async getData(): Promise<AnalyticsData> {
    // TODO: Fix "as"
    const core = (await this.repositories.core.getData()) as CoreItems
    const countries = (await this.repositories.countries.getData()) as Array<Country>
    const devices = (await this.repositories.devices.getData()) as Array<Device>
    const goals = (await this.repositories.goals.getData()) as Goals
    const chart = this.config.chart
      ? ((await this.repositories.chart.getData()) as Record<string, number>)
      : undefined

    return {
      core,
      countries,
      devices,
      goals,
      chart,
    }
  }

  /**
   * Create repositories
   */
  private createRepositories() {
    return {
      core: this.factory.createRepository(RepositoryTypes.core, this.config, this.range),
      countries: this.factory.createRepository(RepositoryTypes.countries, this.config, this.range),
      devices: this.factory.createRepository(RepositoryTypes.devices, this.config, this.range),
      goals: this.factory.createRepository(RepositoryTypes.goals, this.config, this.range),
      chart: this.factory.createRepository(RepositoryTypes.chart, this.config, this.range),
    }
  }
}

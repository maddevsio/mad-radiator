import { AnalyticsChart } from 'analytics/AnalyticsChart'
import { AnalyticsCore } from 'analytics/AnalyticsCore'
import { AnalyticsCountries } from 'analytics/AnalyticsCountries'
import { AnalyticsDevices } from 'analytics/AnalyticsDevices'
import { AnalyticsGoals } from 'analytics/AnalyticsGoals'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'

import { AnalyticsFactory, AnalyticsRepositoryType, RepositoryTypes } from './AnalyticsFactory'

export class AnalyticsService {
  private range: ParsedRange

  protected config: RadiatorConfig

  private factory: AnalyticsFactory

  private repositories: Record<RepositoryTypes, AnalyticsRepositoryType>

  constructor(config: RadiatorConfig, range: ParsedRange) {
    this.config = config
    this.range = range
    this.factory = new AnalyticsFactory()
    this.repositories = this.createRepositories()
  }

  public async getData(): Promise<AnalyticsData> {
    const core = await this.repositories.core.getData()
    const countries = await this.repositories.countries.getData()
    const devices = await this.repositories.devices.getData()
    const goals = await this.repositories.goals.getData()
    const chart = this.config.chart ? await this.repositories.chart.getData() : undefined

    return {
      core,
      countries,
      devices,
      goals,
      chart,
    }
  }

  private createRepositories() {
    return {
      core: this.factory.createRepository<AnalyticsCore>(
        RepositoryTypes.core,
        this.config,
        this.range,
      ),
      countries: this.factory.createRepository<AnalyticsCountries>(
        RepositoryTypes.countries,
        this.config,
        this.range,
      ),
      devices: this.factory.createRepository<AnalyticsDevices>(
        RepositoryTypes.devices,
        this.config,
        this.range,
      ),
      goals: this.factory.createRepository<AnalyticsGoals>(
        RepositoryTypes.goals,
        this.config,
        this.range,
      ),
      chart: this.factory.createRepository<AnalyticsChart>(
        RepositoryTypes.chart,
        this.config,
        this.range,
      ),
    }
  }
}

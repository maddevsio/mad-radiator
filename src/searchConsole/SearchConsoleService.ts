import { auth, searchconsole } from '@googleapis/searchconsole'

import { SearchConsoleError } from '../errors/types/SearchConsoleError'
import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'

import { ISearchConsoleAuthConfig, ISearchConsoleData } from './interfaces'

export class SearchConsoleService implements RadiatorService {
  private readonly config: ISearchConsoleAuthConfig

  constructor(config: ISearchConsoleAuthConfig) {
    this.config = config
  }

  private authorize(): any {
    return new auth.GoogleAuth({
      credentials: {
        private_key: this.config.analyticsPrivateKey,
        client_email: this.config.analyticsClientEmail,
      },
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/webmasters',
      ],
    })
  }

  public async getSiteSearchAnalytics(): Promise<ISearchConsoleData> {
    try {
      const client = searchconsole({
        version: 'v1',
        auth: this.authorize(),
      })

      await client.sites.add({
        siteUrl: this.config.website,
      })

      const response = await client.sitemaps.get({
        feedpath: this.config.websiteSitemap,
        siteUrl: this.config.website,
      })

      return {
        errors: response.data.errors,
        warnings: response.data.warnings,
      }
    } catch (error: any) {
      throw new SearchConsoleError(`Cannot get Search Console data: ${error.message}`)
    }
  }

  public getName(): string {
    return this.constructor.name
  }

  async perform(
    results: BuildMessageDataSpec,
    _radiator: RadiatorSpec,
  ): Promise<BuildMessageDataSpec> {
    return Object.assign(results, {
      searchConsole: await executeWithRetry(
        `${this.getName()}.getSiteSearchAnalytics()`,
        5,
        1500,
        () => this.getSiteSearchAnalytics(),
        (error: any) => error,
      ),
    })
  }
}

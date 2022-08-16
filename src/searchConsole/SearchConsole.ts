import { auth, searchconsole } from '@googleapis/searchconsole'

import { SearchConsoleError } from '../errors/types/SearchConsoleError'

import { ISearchConsoleAuthConfig, ISearchConsoleData } from './interfaces'

export class SearchConsole {
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
}

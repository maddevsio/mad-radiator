import axios, { AxiosResponse } from 'axios'
import { LighthouseError } from 'errors/types/LighthouseError'
import { RadiatorConfig } from 'interfaces'
import { Sitemap } from 'lighthouse/Sitemap'
import {
  LighthouseData,
  LighthouseMetrics,
  LighthousePayload,
  LighthouseUrlResult,
} from 'lighthouse/interfaces'
import { Logger } from 'logger'



export class Lighthouse {
  private readonly config: RadiatorConfig

  private readonly sitemap: Sitemap

  private static url: string = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

  constructor(config: RadiatorConfig) {
    this.config = config
    this.sitemap = new Sitemap(this.config)
  }

  public async getLighthouseMetrics(): Promise<LighthouseData> {
    const urls = await this.sitemap.getAllUrls()

    Logger.info(`Start getting data for ${urls.length} pages`)

    const urlResults: Array<LighthouseUrlResult> = []

    for (const url of urls) {
      Logger.info(`Getting metrics for ${url} page`)
      try {
        const searchParams = this.buildSearchParams(url)
        const payload: AxiosResponse<LighthousePayload> = await axios.get(
          `${Lighthouse.url}?${searchParams}`,
        )
        urlResults.push(Lighthouse.buildUrlResult(payload.data, url))
        Logger.success('Success')
      } catch (error) {
        throw new LighthouseError(`Getting metrics for ${url} page, ${error}`)
      }
    }

    const average = Lighthouse.buildAverageResult(urlResults)
    const { top, worst } = this.getTopAndWorstUrls(urlResults)
    return {
      average,
      top,
      worst,
      urlCount: urlResults.length,
    }
  }

  private static buildUrlResult(data: LighthousePayload, url: string): LighthouseUrlResult {
    const metrics: LighthouseMetrics = Object.values(data.lighthouseResult.categories).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id.replace('-', '_')]: Math.round(curr.score * 100),
      }),
      {},
    ) as LighthouseMetrics

    const total = Object.values(metrics).reduce((acc: number, curr: number) => acc + curr, 0)
    const average = Math.round(total / Object.keys(metrics).length)

    return {
      url,
      metrics,
      average,
    }
  }

  private static buildAverageResult(urlResults: Array<LighthouseUrlResult>): LighthouseMetrics {
    const total = urlResults.reduce(
      (acc, { metrics }) => ({
        performance: acc.performance + metrics.performance,
        accessibility: acc.accessibility + metrics.accessibility,
        seo: acc.seo + metrics.seo,
        pwa: acc.pwa + metrics.pwa,
        best_practices: acc.best_practices + metrics.best_practices,
      }),
      {
        seo: 0,
        pwa: 0,
        performance: 0,
        accessibility: 0,
        best_practices: 0,
      },
    ) as LighthouseMetrics
    if (urlResults.length) {
      return Object.entries(total).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: Math.round(value / urlResults.length),
        }),
        {},
      ) as LighthouseMetrics
    }
    return total
  }

  private getTopAndWorstUrls(urlResults: Array<LighthouseUrlResult>): {
    top: Array<LighthouseUrlResult>
    worst: Array<LighthouseUrlResult>
  } {
    const sorted = urlResults.sort((a, b) => b.average - a.average)

    const top = sorted.slice(0, this.config.lighthouse?.topCount || 3)
    const worst = sorted.reverse().slice(0, this.config.lighthouse?.worstCount || 3)
    return {
      top,
      worst,
    }
  }

  private buildSearchParams(url: string) {
    const searchParams = []
    searchParams.push(['url', url])
    searchParams.push(['key', this.config.env.googleapisKey])
    searchParams.push(['category', 'seo'])
    searchParams.push(['category', 'accessibility'])
    searchParams.push(['category', 'best-practices'])
    searchParams.push(['category', 'performance'])
    searchParams.push(['category', 'pwa'])
    return searchParams.map(arr => arr.join('=')).join('&')
  }
}

import axios, { AxiosResponse } from 'axios'
import { Rate } from 'enums'
import { RadiatorConfig } from 'interfaces'
import { LighthouseData, LighthousePayload } from 'interfaces/lighthouse'

export class LighthouseService {
  private readonly config: RadiatorConfig

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  public async getData() {
    const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
    const searchParams = this.buildSearchParams()
    const payload: AxiosResponse<LighthousePayload> = await axios.get(`${url}?${searchParams}`)

    return this.prettify(payload.data)
  }

  private buildSearchParams() {
    const searchParams = []
    searchParams.push(['url', this.config.websiteUrl])
    searchParams.push(['key', this.config.env.googleapisKey])
    searchParams.push(['category', 'seo'])
    searchParams.push(['category', 'accessibility'])
    searchParams.push(['category', 'best-practices'])
    searchParams.push(['category', 'performance'])
    searchParams.push(['category', 'pwa'])
    return searchParams.map(arr => arr.join('=')).join('&')
  }

  private prettify(data: LighthousePayload): LighthouseData {
    return Object.values(data.lighthouseResult.categories).reduce((acc, curr) => {
      let rate = Rate.neutral
      if (curr.score * 100 >= 90) rate = Rate.good
      if (curr.score * 100 < 50) rate = Rate.bad

      return {
        ...acc,
        [curr.id]: {
          title: curr.title,
          value: Math.round(curr.score * 100),
          rate,
        },
      }
    }, {})
  }
}

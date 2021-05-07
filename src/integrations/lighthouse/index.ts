import axios, { AxiosResponse } from 'axios'
import { Rate } from 'enums'
import { RadiatorConfig } from 'interfaces'
import { LighthouseData, LighthousePayload } from 'interfaces/lighthouse'

function buildSearchParams(config: RadiatorConfig) {
  const searchParams = []
  searchParams.push(['url', config.websiteUrl])
  searchParams.push(['key', config.env.googleapisKey])
  searchParams.push(['category', 'seo'])
  searchParams.push(['category', 'accessibility'])
  searchParams.push(['category', 'best-practices'])
  searchParams.push(['category', 'performance'])
  searchParams.push(['category', 'pwa'])
  return searchParams.map(arr => arr.join('=')).join('&')
}

function prettify(data: LighthousePayload): LighthouseData {
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

export default async function getLighthouseData(config: RadiatorConfig): Promise<LighthouseData> {
  const url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
  const searchParams = buildSearchParams(config)
  const payload: AxiosResponse<LighthousePayload> = await axios.get(`${url}?${searchParams}`)

  return prettify(payload.data)
}

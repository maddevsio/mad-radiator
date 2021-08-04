import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import axios, { AxiosResponse } from 'axios'
import { RadiatorConfig, Rate } from 'interfaces'
import { LighthousePayload } from 'lighthouse/interfaces'
import { Lighthouse } from 'lighthouse/Lighthouse'

const responseData: AxiosResponse<LighthousePayload> = {
  data: {
    lighthouseResult: {
      categories: [
        {
          id: '1',
          title: 'one',
          score: 0.99,
        },
        {
          id: '2',
          title: 'two',
          score: 0.7,
        },
        {
          id: '3',
          title: 'three',
          score: 0.3,
        },
      ],
    },
  },
  status: 200,
  statusText: 'success',
  headers: {},
  config: {},
}

jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(responseData))

describe('Lighthouse service', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly created service without Slack/TG instances', () => {
    const service = new Lighthouse(config)

    expect(service.getLighthouseMetrics).toBeTruthy()
  })

  it('should correctly called getData method', async () => {
    const service = new Lighthouse(config)

    const data = await service.getLighthouseMetrics()

    expect(data).toEqual({
      1: {
        title: 'one',
        value: 99,
        rate: Rate.good,
      },
      2: {
        title: 'two',
        value: 70,
        rate: Rate.neutral,
      },
      3: {
        title: 'three',
        value: 30,
        rate: Rate.bad,
      },
    })
    expect(axios.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=&key=&category=seo&category=accessibility&category=best-practices&category=performance&category=pwa',
    )
  })
})

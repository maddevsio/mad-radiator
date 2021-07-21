import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import axios, { AxiosResponse } from 'axios'
import { Rate } from 'enums'
import { RadiatorConfig } from 'interfaces'
import { LighthousePayload } from 'interfaces/lighthouse'
import { LighthouseService } from 'services/Lighthouse.service'

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
    const service = new LighthouseService(config)

    expect(service.getData).toBeTruthy()
  })

  it('should correctly called getData method', async () => {
    const service = new LighthouseService(config)

    const data = await service.getData()

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

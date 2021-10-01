import { fakeResponse } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { AnalyticsService } from 'analytics/AnalyticsService'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

describe('AnalyticsService', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly return an instance', () => {
    const service = new AnalyticsService(config, parsedRange)
    expect(service.getData).toBeTruthy()
  })

  it('getData should correctly return data from analytics', async () => {
    const OriginalDate = Date
    // @ts-ignore
    jest.spyOn(global, 'Date').mockImplementation(() => new OriginalDate(2021, 6, 30))

    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const service = new AnalyticsService(config, parsedRange)
    const analytics = await service.getData()

    expect(analytics).toEqual({
      chart: {
        '27/7/2021': 10,
        '28/7/2021': 10,
        '29/7/2021': 10,
      },
      core: {
        bounceRate: {
          difference: '+100',
          previous: 4,
          rate: 'bad',
          value: 12,
        },
        duration: {
          difference: '0',
          previous: '4s',
          rate: 'bad',
          value: '4s',
        },
        sessions: {
          difference: '-133.33',
          previous: 10,
          rate: 'bad',
          value: 2,
        },
        users: {
          difference: '+66.67',
          previous: 5,
          rate: 'good',
          value: 10,
        },
      },
      countries: [
        {
          percentage: 100,
          rate: 'neutral',
          title: 'Other',
          value: 10,
        },
      ],
      devices: [
        {
          previous: 100,
          rate: 'good',
          title: '(not set)',
          value: 100,
        },
      ],
      goals: [
        {
          emoji: 'zap',
          name: 'Leads',
          previous: 39,
          rate: 'bad',
          value: 33,
        },
        {
          emoji: 'telephone_receiver',
          name: 'Contacts',
          previous: 39,
          rate: 'bad',
          value: 33,
        },
        {
          emoji: 'briefcase',
          name: 'Careers',
          previous: 39,
          rate: 'bad',
          value: 33,
        },
      ],
      blogs:[]
    })
  })
})

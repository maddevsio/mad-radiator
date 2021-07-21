import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'
import { AnalyticsPayload } from 'interfaces/analytics'
import { AnalyticsService } from 'services/Analytics.service'
import { LoggerService } from 'services/Logger.service'

jest.spyOn(LoggerService, 'error').mockImplementation(() => {})

jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    options: jest.fn(),
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

  it('should correctly return data', async () => {
    const fakeResponse = {
      data: {
        reports: [
          {
            data: {
              rows: [
                {
                  dimensions: ['(not set)', '2', '3'],
                  metrics: [
                    {
                      values: [10, 2, 3],
                    },
                    {
                      values: [5, 10, 3],
                    },
                  ],
                },
              ],
              totals: [
                {
                  values: [10, 2, 12, 4, 5],
                },
                {
                  values: [5, 10, 4, 4, 16],
                },
              ],
            },
          },
        ] as AnalyticsPayload,
      },
    }
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const service = new AnalyticsService(config, parsedRange)

    const data = await service.getData()

    expect(LoggerService.error).toHaveBeenCalledTimes(0)

    expect(data).toEqual({
      chart: {
        '18/7/2021': 10,
        '19/7/2021': 10,
        '20/7/2021': 10,
      },
      core: {
        bounceRate: {
          difference: '+200',
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
          difference: '-80',
          previous: 10,
          rate: 'bad',
          value: 2,
        },
        users: {
          difference: '+100',
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
    })
  })

  it('should correctly return data(second case)', async () => {
    const fakeResponse = {
      data: {
        reports: [
          {
            data: {
              rows: [
                {
                  dimensions: ['123'],
                  metrics: [
                    {
                      values: [5, 10, 3],
                    },
                    {
                      values: [10, 2, 3],
                    },
                  ],
                },
                {
                  dimensions: ['Russia'],
                  metrics: [
                    {
                      values: [15, 10, 3],
                    },
                    {
                      values: [12, 23, 30],
                    },
                  ],
                },
              ],
              totals: [
                {
                  values: [5, 10, 4, 5, 16],
                },
                {
                  values: [10, 2, 12, 4, 5],
                },
              ],
            },
          },
        ] as AnalyticsPayload,
      },
    }
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const service = new AnalyticsService(config, parsedRange)

    const data = await service.getData()

    expect(data).toEqual({
      chart: {
        '18/7/2021': 5,
        '19/7/2021': 5,
        '20/7/2021': 5,
      },
      core: {
        bounceRate: {
          difference: '-66.67',
          previous: 12,
          rate: 'good',
          value: 4,
        },
        duration: {
          difference: '+25',
          previous: '4s',
          rate: 'good',
          value: '5s',
        },
        sessions: {
          difference: '+400',
          previous: 2,
          rate: 'good',
          value: 10,
        },
        users: {
          difference: '-50',
          previous: 10,
          rate: 'bad',
          value: 5,
        },
      },
      countries: [
        {
          percentage: 300,
          rate: 'neutral',
          title: 'Russia',
          value: 15,
        },
        {
          percentage: 100,
          rate: 'neutral',
          title: '123',
          value: 5,
        },
      ],
      devices: [
        {
          previous: 120,
          rate: 'good',
          title: 'russia',
          value: 300,
        },
        {
          previous: 100,
          rate: 'good',
          title: '123',
          value: 100,
        },
      ],
      goals: [
        {
          emoji: 'zap',
          name: 'Leads',
          previous: 33,
          rate: 'good',
          value: 40,
        },
        {
          emoji: 'telephone_receiver',
          name: 'Contacts',
          previous: 33,
          rate: 'good',
          value: 40,
        },
        {
          emoji: 'briefcase',
          name: 'Careers',
          previous: 33,
          rate: 'good',
          value: 40,
        },
      ],
    })
  })
})

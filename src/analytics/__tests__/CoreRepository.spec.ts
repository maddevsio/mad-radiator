import {
  fakeResponse,
  fakeResponseSecond,
} from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { CoreRepository } from 'analytics/CoreRepository'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

describe('CoreRepository', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly return an instance', () => {
    const repository = new CoreRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new CoreRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual({
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
    })
  })

  it('should correctly return data(alternative case)', async () => {
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponseSecond))
        },
      },
    }))

    const repository = new CoreRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual({
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
    })
  })
})

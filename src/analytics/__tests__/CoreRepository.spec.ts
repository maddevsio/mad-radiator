import { fakeResponseForCoreData } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { CoreRepository } from 'analytics/CoreRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  },
}))

describe('CoreRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new CoreRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponseForCoreData))
        },
      },
    }))

    const repository = new CoreRepository(config, parsedRange)

    const data = await repository.getData()

    expect(data).toEqual({
      bounceRate: {
        difference: '-199.99',
        previous: 9750,
        rate: 'good',
        value: 0.23,
      },
      duration: {
        difference: '-52.54',
        previous: '5m 19s',
        rate: 'bad',
        value: '3m 6s',
      },
      monthlyUsers: {
        value: 9919,
      },
      sessions: {
        difference: '-127.81',
        previous: 2888,
        rate: 'bad',
        value: 636,
      },
      users: {
        difference: '+61.48',
        previous: 285,
        rate: 'good',
        value: 538,
      },
      weeklyUsers: {
        value: 2898,
      }
    })
  })
})

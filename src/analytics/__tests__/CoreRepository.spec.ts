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
        difference: '0',
        previous: 0.21,
        rate: 'bad',
        value: 0.21,
      },
      duration: {
        difference: '-17.18',
        previous: '3m 24s',
        rate: 'bad',
        value: '2m 52s',
      },
      sessions: {
        difference: '-1.27',
        previous: 633,
        rate: 'bad',
        value: 625,
      },
      users: {
        difference: '-2.83',
        previous: 538,
        rate: 'bad',
        value: 523,
      },
    })
  })
})

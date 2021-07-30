import {
  fakeResponse,
  fakeResponseSecond,
} from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

describe('CountriesRepository', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly return an instance', () => {
    const repository = new CountriesRepository(config, parsedRange)
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

    const repository = new CountriesRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
      {
        percentage: 100,
        rate: 'neutral',
        title: 'Other',
        value: 10,
      },
    ])
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

    const repository = new CountriesRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
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
    ])
  })
})

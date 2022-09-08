/* eslint-disable */
import { fakeResponseForCountries, fakeResponseSecond } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  }
}))

describe('CountriesRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new CountriesRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponseForCountries))
        },
      },
    }))

    const repository = new CountriesRepository(config, parsedRange)
    const data = await repository.getData()

    expect(data).toEqual([
      { title: 'United States', value: 81, percentage: 15.06, rate: 'neutral' },
      { title: 'Ukraine', value: 11, percentage: 2.04, rate: 'neutral' },
      { title: 'Indonesia', value: 10, percentage: 1.86, rate: 'neutral' }
    ])
  })

  it('should correctly return data(alternative case)', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponseSecond))
        },
      },
    }))

    const repository = new CountriesRepository(config, parsedRange)
    const data = await repository.getData()

    expect(data).toEqual([
      { title: 'Kyrgyzstan', value: 71, percentage: 100, rate: 'neutral' },
      { title: 'India', value: 69, percentage: 97.18, rate: 'neutral' },
      {
        title: 'United States',
        value: 51,
        percentage: 71.83,
        rate: 'neutral'
      }
    ])
  })
})

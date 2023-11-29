/* eslint-disable */
import { pagesFakeResponse } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { PagesRepository } from 'analytics/PagesRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  },
}))

describe('PagesRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new PagesRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(pagesFakeResponse))
        },
      },
    }))

    const result = [
      {
        pagePath: 'https://maddevs.io/writeups/hackthebox-codify/',
        pageViews: 153
      },
      {
        pagePath: 'https://maddevs.io/writeups/',
        pageViews: 120,
      },
      {
        pagePath: 'https://maddevs.io/blog/',
        pageViews: 59
      },
    ]

    const repository = new PagesRepository(config, parsedRange)
    const data = await repository.getData()

    expect(data).toEqual(result)
  })
})
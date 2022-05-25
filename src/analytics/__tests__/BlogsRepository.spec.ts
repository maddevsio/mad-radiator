import { blogFakeResponse } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { BlogsRepository } from 'analytics/BlogsRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  },
}))

describe('BlogRepository', () => {
  let config: AnalyticsParams
  let secondConfig: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
    secondConfig = { ...defaultAnalyticsParams, pagesPathForViewsAnalytics: [] }
  })

  it('should correctly return an instance', () => {
    const repository = new BlogsRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(blogFakeResponse))
        },
      },
    }))

    const repository = new BlogsRepository(config, parsedRange)
    const data = await repository.getData()

    expect(data).toEqual([
      {
        pagePath: 'https://maddevs.io/blog/main-software-development-metrics-and-kpis/',
        pageViews: 112
      }
    ])
  })

  it('you should correctly return an empty array if there is no pagesPathForViewsAnalytics in the settings', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(blogFakeResponse))
        },
      },
    }))

    const repository = new BlogsRepository(secondConfig, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([])
  })
})

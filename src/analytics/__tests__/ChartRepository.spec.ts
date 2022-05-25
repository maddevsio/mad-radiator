import { fakeResponse } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { ChartRepository } from 'analytics/ChartRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  },
}))

const OriginalDate = Date
// @ts-ignore
jest.spyOn(global, 'Date').mockImplementation(() => new OriginalDate(2021, 6, 30))

describe('ChartRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new ChartRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()
    expect(chartData).toEqual({
      "1/5/2021": 0,
      "10/6/2021": 0,
      "10/7/2021": 0,
      "11/5/2021": 0,
      "15/6/2021": 0,
      "15/7/2021": 0,
      "16/5/2021": 0,
      "20/6/2021": 0,
      "20/7/2021": 0,
      "21/5/2021": 0,
      "25/6/2021": 0,
      "25/7/2021": 0,
      "26/5/2021": 0,
      "29/7/2021": 0,
      "30/6/2021": 0,
      "31/5/2021": 0,
      "5/6/2021": 0,
      "5/7/2021": 0,
      "6/5/2021": 0,
    })
  })

  it('should correctly return data with default params', async () => {
    config.chart = undefined
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()

    expect(chartData).toEqual({
      "16/7/2021": 0,
      "17/7/2021": 0,
      "18/7/2021": 0,
      "19/7/2021": 0,
      "20/7/2021": 0,
      "21/7/2021": 0,
      "22/7/2021": 0,
      "23/7/2021": 0,
      "24/7/2021": 0,
      "25/7/2021": 0,
      "26/7/2021": 0,
      "27/7/2021": 0,
      "28/7/2021": 0,
      "29/7/2021": 0,
    })
  })

  it('should correctly return data with filtred range', async () => {
    config.chart = {
      chartView: 'line',
      period: 100,
      type: 'users',
    }
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()
    expect(chartData).toEqual({
      "1/5/2021": 0,
      "10/6/2021": 0,
      "10/7/2021": 0,
      "11/5/2021": 0,
      "15/6/2021": 0,
      "15/7/2021": 0,
      "16/5/2021": 0,
      "20/6/2021": 0,
      "20/7/2021": 0,
      "21/4/2021": 0,
      "21/5/2021": 0,
      "25/6/2021": 0,
      "25/7/2021": 0,
      "26/4/2021": 0,
      "26/5/2021": 0,
      "29/7/2021": 0,
      "30/6/2021": 0,
      "31/5/2021": 0,
      "5/6/2021": 0,
      "5/7/2021": 0,
      "6/5/2021": 0,
    })
  })
})

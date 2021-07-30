import { fakeResponse } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { ChartRepository } from 'analytics/ChartRepository'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

const OriginalDate = Date
// @ts-ignore
jest.spyOn(global, 'Date').mockImplementation(() => new OriginalDate(2021, 6, 30))

describe('ChartRepository', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly return an instance', () => {
    const repository = new ChartRepository(config, parsedRange)
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

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()
    expect(chartData).toEqual({
      '27/7/2021': 10,
      '28/7/2021': 10,
      '29/7/2021': 10,
    })
  })

  it('should correctly return data with default params', async () => {
    config.chart = undefined
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()
    expect(chartData).toEqual({
      '16/7/2021': 10,
      '17/7/2021': 10,
      '18/7/2021': 10,
      '19/7/2021': 10,
      '20/7/2021': 10,
      '21/7/2021': 10,
      '22/7/2021': 10,
      '23/7/2021': 10,
      '24/7/2021': 10,
      '25/7/2021': 10,
      '26/7/2021': 10,
      '27/7/2021': 10,
      '28/7/2021': 10,
      '29/7/2021': 10,
    })
  })

  it('should correctly return data with filtred range', async () => {
    config.chart = {
      period: 100,
      type: 'users',
    }
    // @ts-ignore
    google.analyticsreporting.mockImplementation(() => ({
      reports: {
        batchGet() {
          return new Promise(res => res(fakeResponse))
        },
      },
    }))

    const repository = new ChartRepository(config, parsedRange)
    const chartData = await repository.getData()
    expect(chartData).toEqual({
      '1/5/2021': 10,
      '10/6/2021': 10,
      '10/7/2021': 10,
      '11/5/2021': 10,
      '15/6/2021': 10,
      '15/7/2021': 10,
      '16/5/2021': 10,
      '20/6/2021': 10,
      '20/7/2021': 10,
      '21/4/2021': 10,
      '21/5/2021': 10,
      '25/6/2021': 10,
      '25/7/2021': 10,
      '26/4/2021': 10,
      '26/5/2021': 10,
      '30/6/2021': 10,
      '31/5/2021': 10,
      '5/6/2021': 10,
      '5/7/2021': 10,
      '6/5/2021': 10,
    })
  })
})

import {
  fakeResponse,
  fakeResponseSecond,
} from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { DevicesRepository } from 'analytics/DevicesRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

describe('DevicesRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new DevicesRepository(config, parsedRange)
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

    const repository = new DevicesRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
      {
        previous: 100,
        rate: 'good',
        title: '(not set)',
        value: 100,
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

    const repository = new DevicesRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
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
    ])
  })
})

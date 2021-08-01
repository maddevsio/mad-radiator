import {
  fakeResponse,
  fakeResponseSecond,
} from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { GoalsRepository } from 'analytics/GoalsRepository'
import { google } from 'googleapis'
import { RadiatorConfig } from 'interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(),
  },
}))

describe('GoalsRepository', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
  })

  it('should correctly return an instance', () => {
    const repository = new GoalsRepository(config, parsedRange)
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

    const repository = new GoalsRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
      {
        emoji: 'zap',
        name: 'Leads',
        previous: 39,
        rate: 'bad',
        value: 33,
      },
      {
        emoji: 'telephone_receiver',
        name: 'Contacts',
        previous: 39,
        rate: 'bad',
        value: 33,
      },
      {
        emoji: 'briefcase',
        name: 'Careers',
        previous: 39,
        rate: 'bad',
        value: 33,
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

    const repository = new GoalsRepository(config, parsedRange)

    const data = await repository.getData()
    expect(data).toEqual([
      {
        emoji: 'zap',
        name: 'Leads',
        previous: 33,
        rate: 'good',
        value: 40,
      },
      {
        emoji: 'telephone_receiver',
        name: 'Contacts',
        previous: 33,
        rate: 'good',
        value: 40,
      },
      {
        emoji: 'briefcase',
        name: 'Careers',
        previous: 33,
        rate: 'good',
        value: 40,
      },
    ])
  })
})

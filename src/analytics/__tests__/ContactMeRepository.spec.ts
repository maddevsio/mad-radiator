/* eslint-disable */
import { fakeResponseForEvents } from '__tests__/fixtures/analytics/fakeAnalyticsResponses'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { ContactMeRepository } from 'analytics/ContactMeRepository'
import { google } from 'googleapis'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'
import { AnalyticsParams } from '../interfaces'

jest.mock('googleapis', () => ({
  google: {
    analyticsdata: jest.fn(),
  },
}))

const mockedContactMeData = {
  contactMePerDay: {
    value: 4,
  },
  contactMePerMonth: {
    value: 4,
  },
}

describe('ContactMeRepository', () => {
  let config: AnalyticsParams

  beforeEach(() => {
    config = defaultAnalyticsParams
  })

  it('should correctly return an instance', () => {
    const repository = new ContactMeRepository(config, parsedRange)
    expect(repository.getData).toBeTruthy()
  })

  it('should correctly return data', async () => {
    // @ts-ignore
    google.analyticsdata.mockImplementation(() => ({
      properties: {
        runReport() {
          return new Promise(res => res(fakeResponseForEvents))
        },
      },
    }))

    const repository = new ContactMeRepository(config, parsedRange)
    const data = await repository.getData()

    expect(data).toStrictEqual(mockedContactMeData)
  })
})

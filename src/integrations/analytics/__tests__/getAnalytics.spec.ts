import { RangeType } from 'enums'
import { google } from 'googleapis'
import { getAnalytics } from 'integrations/analytics/getAnalytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

jest.mock('googleapis', () => ({
  google: {
    analyticsreporting: jest.fn(() => ({
      reports: {
        batchGet: jest.fn(() => new Promise(res => res({ data: 'data' }))),
      },
    })),
  },
}))

describe('Radiator > analytics > getAnalytics', () => {
  it('shoult correctly called googleAnalytics method and returns data', async () => {
    const baseRange = {
      startDate: '7DaysAgo',
      endDate: '1DaysAgo',
    }

    const range = {
      originalRange: baseRange,
      previousRange: baseRange,
      range: RangeType.day,
      text: 'Today',
    }
    const data = await getAnalytics([], [], range, radiatorConfigFixture)
    expect(data).toEqual([])
    expect(google.analyticsreporting).toHaveBeenCalledTimes(1)
  })
})

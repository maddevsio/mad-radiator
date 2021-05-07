import { RangeType } from 'enums'
import * as analytics from 'integrations/analytics/getAnalytics'
import { getCoreData } from 'integrations/analytics/getCoreData'
import { AnalyticsPayload } from 'interfaces/analytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > analytics > getCoreData', () => {
  it('should correctly prettify raw data and returns it', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          rows: [],
          totals: [
            {
              values: [10, 20, 30, 40],
            },
            {
              values: [5, 10, 15, 20],
            },
          ],
        },
      },
    ]

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

    jest.spyOn(analytics, 'getAnalytics').mockImplementation(() => new Promise(res => res(payload)))

    const data = await getCoreData(range, radiatorConfigFixture)

    expect(analytics.getAnalytics).toHaveBeenCalledTimes(1)
    expect(data).toEqual({
      bounceRate: {
        difference: '+100',
        rate: 'bad',
        previous: 15,
        value: 30,
      },
      duration: {
        difference: '+100',
        rate: 'good',
        previous: '20s',
        value: '40s',
      },
      sessions: {
        difference: '+100',
        rate: 'good',
        previous: 10,
        value: 20,
      },
      users: {
        difference: '+100',
        rate: 'good',
        previous: 5,
        value: 10,
      },
    })
  })

  it('should correctly prettify raw data and returns it with another data', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          rows: [],
          totals: [
            {
              values: [5, 10, 15, 20],
            },
            {
              values: [10, 20, 30, 40],
            },
          ],
        },
      },
    ]

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

    jest.spyOn(analytics, 'getAnalytics').mockImplementation(() => new Promise(res => res(payload)))

    const data = await getCoreData(range, radiatorConfigFixture)

    expect(data).toEqual({
      bounceRate: {
        difference: '-50',
        rate: 'good',
        previous: 30,
        value: 15,
      },
      duration: {
        difference: '-50',
        rate: 'bad',
        previous: '40s',
        value: '20s',
      },
      sessions: {
        difference: '-50',
        rate: 'bad',
        previous: 20,
        value: 10,
      },
      users: {
        difference: '-50',
        rate: 'bad',
        previous: 10,
        value: 5,
      },
    })
  })
})

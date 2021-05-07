import { RangeType } from 'enums'
import * as analytics from 'integrations/analytics/getAnalytics'
import { getGoalsData } from 'integrations/analytics/getGoalsData'
import { AnalyticsPayload } from 'interfaces/analytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > analytics > getGoalsData', () => {
  it('should correctly prettify raw data and returns it', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          rows: [],
          totals: [
            {
              values: [0, 0, 0, 3, 2, 0, 1, 0, 2],
            },
            {
              values: [2, 0, 0, 4, 0, 1, 0, 0, 0],
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

    const data = await getGoalsData(range, radiatorConfigFixture)

    expect(analytics.getAnalytics).toHaveBeenCalledTimes(3)
    expect(data).toEqual({
      leads: {
        rate: 'good',
        previous: 7,
        value: 8,
      },
      career: {
        rate: 'good',
        previous: 7,
        value: 8,
      },
      contacts: {
        rate: 'good',
        previous: 7,
        value: 8,
      },
    })
  })

  it('should correctly prettify raw data and returns it with bad rate', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          rows: [],
          totals: [
            {
              values: [0, 0, 0, 3, 2, 0, 1, 0, 2],
            },
            {
              values: [2, 0, 0, 4, 0, 1, 0, 0, 3],
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

    const data = await getGoalsData(range, radiatorConfigFixture)

    expect(data).toEqual({
      leads: {
        rate: 'bad',
        previous: 10,
        value: 8,
      },
      career: {
        rate: 'bad',
        previous: 10,
        value: 8,
      },
      contacts: {
        rate: 'bad',
        previous: 10,
        value: 8,
      },
    })
  })
})

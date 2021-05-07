import { RangeType } from 'enums'
import * as analytics from 'integrations/analytics/getAnalytics'
import { getCountriesData } from 'integrations/analytics/getCountriesData'
import { AnalyticsPayload } from 'interfaces/analytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > analytics > getCountriesData', () => {
  it('should correctly prettify raw data and returns it', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          totals: [
            {
              values: [200],
            },
          ],
          rows: [
            {
              dimensions: ['United States'],
              metrics: [
                {
                  values: [50],
                },
              ],
            },
            {
              dimensions: ['(not set)'],
              metrics: [
                {
                  values: [3],
                },
              ],
            },
            {
              dimensions: ['Russia'],
              metrics: [
                {
                  values: [30],
                },
              ],
            },
            {
              dimensions: ['France'],
              metrics: [
                {
                  values: [10],
                },
              ],
            },
            {
              dimensions: ['India'],
              metrics: [
                {
                  values: [5],
                },
              ],
            },
            {
              dimensions: ['Kyrgyzstan'],
              metrics: [
                {
                  values: [5],
                },
              ],
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

    const data = await getCountriesData(range, radiatorConfigFixture)

    expect(analytics.getAnalytics).toHaveBeenCalledTimes(1)
    expect(data).toEqual([
      {
        percentage: 25,
        title: 'United States',
        value: 50,
        rate: 'neutral',
      },
      {
        percentage: 15,
        title: 'Russia',
        value: 30,
        rate: 'neutral',
      },
      {
        percentage: 5,
        title: 'France',
        value: 10,
        rate: 'neutral',
      },
    ])
  })
})

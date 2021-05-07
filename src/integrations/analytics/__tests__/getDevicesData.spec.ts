import { RangeType } from 'enums'
import * as analytics from 'integrations/analytics/getAnalytics'
import { getDevicesData } from 'integrations/analytics/getDevicesData'
import { AnalyticsPayload } from 'interfaces/analytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > analytics > getDevicesData', () => {
  it('should correctly prettify raw data and returns it', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          totals: [
            {
              values: [50],
            },
            {
              values: [40],
            },
          ],
          rows: [
            {
              dimensions: ['desktop'],
              metrics: [
                {
                  values: [65],
                },
                {
                  values: [50],
                },
              ],
            },
            {
              dimensions: ['mobile'],
              metrics: [
                {
                  values: [30],
                },
                {
                  values: [40],
                },
              ],
            },
            {
              dimensions: ['tablet'],
              metrics: [
                {
                  values: [5],
                },
                {
                  values: [10],
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

    const data = await getDevicesData(range, radiatorConfigFixture)

    expect(analytics.getAnalytics).toHaveBeenCalledTimes(1)
    expect(data).toEqual([
      {
        rate: 'good',
        previous: 125,
        title: 'desktop',
        value: 130,
      },
      {
        rate: 'neutral',
        previous: 100,
        title: 'mobile',
        value: 60,
      },
      {
        rate: 'neutral',
        previous: 25,
        title: 'tablet',
        value: 10,
      },
    ])
  })

  it('should correctly prettify raw data without tablet info', async () => {
    const payload: AnalyticsPayload = [
      {
        data: {
          totals: [
            {
              values: [50],
            },
            {
              values: [40],
            },
          ],
          rows: [
            {
              dimensions: ['desktop'],
              metrics: [
                {
                  values: [65],
                },
                {
                  values: [50],
                },
              ],
            },
            {
              dimensions: ['mobile'],
              metrics: [
                {
                  values: [30],
                },
                {
                  values: [40],
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

    const data = await getDevicesData(range, radiatorConfigFixture)

    expect(data).toEqual([
      {
        rate: 'good',
        previous: 125,
        title: 'desktop',
        value: 130,
      },
      {
        rate: 'neutral',
        previous: 100,
        title: 'mobile',
        value: 60,
      },
    ])
  })
})

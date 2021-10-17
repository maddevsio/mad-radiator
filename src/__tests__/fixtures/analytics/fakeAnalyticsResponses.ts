import { AnalyticsPayload } from 'analytics/interfaces'

export const fakeResponse = {
  data: {
    reports: [
      {
        data: {
          rows: [
            {
              dimensions: ['(not set)', '2', '3'],
              metrics: [
                {
                  values: [10, 2, 3],
                },
                {
                  values: [5, 10, 3],
                },
              ],
            },
          ],
          totals: [
            {
              values: [10, 2, 12, 4, 5],
            },
            {
              values: [5, 10, 4, 4, 16],
            },
          ],
        },
      },
    ] as AnalyticsPayload,
  },
}

export const fakeResponseSecond = {
  data: {
    reports: [
      {
        data: {
          rows: [
            {
              dimensions: ['123'],
              metrics: [
                {
                  values: [5, 10, 3],
                },
                {
                  values: [10, 2, 3],
                },
              ],
            },
            {
              dimensions: ['Russia'],
              metrics: [
                {
                  values: [15, 10, 3],
                },
                {
                  values: [12, 23, 30],
                },
              ],
            },
          ],
          totals: [
            {
              values: [5, 10, 4, 5, 16],
            },
            {
              values: [10, 2, 12, 4, 5],
            },
          ],
        },
      },
    ] as AnalyticsPayload,
  },
}

export const blogFakeResponse = {
  data: {
    reports: [
      {
        data: {
          rows: [
            {
              dimensions: ['/insights/blog/seo-analyzer/'],
              metrics: [
                {
                  values: [10, 2, 3],
                },
              ],
            },
            {
              dimensions: ['/customer-university/custom-software-development-pricing-strategies/'],
              metrics: [
                {
                  values: [10, 2, 3],
                },
              ],
            },
            {
              dimensions: ['/insights/blog/'],
              metrics: [
                {
                  values: [10, 2, 3],
                },
              ],
            },
          ],
          totals: [
            {
              values: [10, 2, 12, 4, 5],
            },
            {
              values: [5, 10, 4, 4, 16],
            },
          ],
        },
      },
    ] as AnalyticsPayload,
  },
}

export const defaultAnalyticsParams =
  {
    analyticsViewId: '230523659',
    websiteUrl: 'https://maddevs.io',
    range: 'day',
    chart: {
      type: 'users',
      period: 3,
      chartView: 'bar',
    },
    pagesPathForViewsAnalytics: [
      '/customer-university/',
      '/insights/blog/',
    ],
    analyticsConversions: [
      {
        name: 'Leads',
        emoji: 'zap',
        goals: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        name: 'Contacts',
        emoji: 'telephone_receiver',
        goals: [10, 11, 12, 13, 14, 15],
      },
      {
        name: 'Careers',
        emoji: 'briefcase',
        goals: [9],
      },
    ],
  }

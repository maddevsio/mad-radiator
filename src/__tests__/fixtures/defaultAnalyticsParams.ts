export const defaultAnalyticsParams = {
  pagesPathForViewsAnalytics: ['/customer-university/', '/blog/'],
  websiteUrl: 'https://maddevs.io',
  totalUsersToEnji: {
    url: 'https://staging.enji.ai',
  },
  chart: {
    chartView: 'bar',
    type: 'totalUsers',
    period: 90,
  },
  analyticsViewId: '294117887',
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

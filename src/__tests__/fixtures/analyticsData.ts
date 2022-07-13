import { AnalyticsData } from 'analytics/interfaces'
import { Rate } from 'interfaces'

export const analyticsData: AnalyticsData = {
  core: {
    users: {
      value: 100,
      previous: 50,
      difference: '100%',
      rate: Rate.good,
    },
    sessions: {
      value: 100,
      previous: 50,
      difference: '100%',
      rate: Rate.good,
    },
    bounceRate: {
      value: 100,
      previous: 50,
      difference: '100%',
      rate: Rate.good,
    },
    duration: {
      value: 100,
      previous: 50,
      difference: '100%',
      rate: Rate.good,
    },
    weeklyUsers: {
      value: 2888,
      rate: Rate.good,
    },
    monthlyUsers: {
      value: 10001,
      rate: Rate.good
    }
  },
  countries: [
    {
      title: 'Russia',
      value: 100,
      rate: Rate.good,
      percentage: 100,
    },
  ],
  chart: {
    key: 0,
    key2: 10,
  },
  blogs: [
    {
      pagePath: 'https://maddevs.io/insights/blog/how-to-start-developing-for-raspberry-pi-with-qt/',
      pageViews: 19,
    },
  ],
  contactMe: {
      value: 4
  },
  ebookDownloads: [
    {
      value: 4,
      name: 'Aproach DP'
    },
  ],
  subscribers: {
    value: 1,
  },
}

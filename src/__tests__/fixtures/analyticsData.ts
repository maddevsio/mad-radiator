import { Rate } from 'enums'
import { AnalyticsData } from 'interfaces/analytics'

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
  },
  countries: [
    {
      title: 'Russia',
      value: 100,
      rate: Rate.good,
      percentage: 100,
    },
  ],
  devices: [
    {
      title: 'mobile',
      value: 100,
      previous: 50,
    },
  ],
  goals: [
    {
      name: 'Name',
      emoji: '+1',
      value: 100,
      previous: 95,
      rate: Rate.good,
    },
  ],
}

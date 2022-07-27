import { ChartBuilder } from 'chartBuilder/ChartBuilder'

describe('ChartBuilder', () => {
  it('should correctly create an instance', () => {
    const analyticsParams = {
      analyticsViewId: '1',
      websiteUrl: 'https://maddevs.io/',
      totalUsersToEnji: {
        url: "https://staging.enji.ai/"
      },
      chart: {
        type: 'users',
        period: 90,
        chartView: 'line'
      },
      pagesPathForViewsAnalytics: ['some', 'strings'],
      analyticsConversions: [{
        name: 'name',
        emoji: 'emoji',
        goals: [1, 2, 3]
      }]
    }

    const builder = new ChartBuilder(analyticsParams)

    expect(builder.renderChart).toBeTruthy()
  })
})

import { Emoji, RangeType, Rate } from 'enums'
import main from 'integrations/slack'
import * as buildMessage from 'integrations/slack/buildMessage'
import * as sendMessage from 'integrations/slack/sendMessage'
import { ParsedRange } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { SlackMessage } from 'interfaces/slack'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

describe('Radiator > slack > index', () => {
  it('should correctly called build and send message functions', async () => {
    jest.spyOn(buildMessage, 'buildMessage').mockImplementation((): SlackMessage => ({}))
    jest.spyOn(sendMessage, 'sendMessage').mockImplementation(() => Promise.resolve())

    const analytics: AnalyticsData = {
      core: {
        bounceRate: {
          difference: '+100',
          rate: Rate.good,
          previous: 15,
          value: 30,
        },
        duration: {
          difference: '+100',
          rate: Rate.good,
          previous: '20s',
          value: '40s',
        },
        sessions: {
          difference: '+100',
          rate: Rate.good,
          previous: 10,
          value: 20,
        },
        users: {
          difference: '+100',
          rate: Rate.good,
          previous: 5,
          value: 10,
        },
      },
      countries: [
        {
          rate: Rate.neutral,
          percentage: 25,
          title: 'United States',
          value: 50,
        },
        {
          rate: Rate.neutral,
          percentage: 15,
          title: 'Russia',
          value: 30,
        },
        {
          rate: Rate.neutral,
          percentage: 5,
          title: 'France',
          value: 10,
        },
      ],
      devices: [
        {
          rate: Rate.good,
          previous: 125,
          title: 'desktop',
          value: 130,
        },
        {
          rate: Rate.neutral,
          previous: 100,
          title: 'mobile',
          value: 60,
        },
        {
          rate: Rate.neutral,
          previous: 25,
          title: 'tablet',
          value: 10,
        },
      ],
      goals: [
        {
          name: 'Career',
          previous: 0,
          value: 2,
          rate: Rate.good,
          emoji: Emoji.zap,
        },
      ],
    }

    const defaultRange = {
      startDate: 'start',
      endDate: 'end',
    }

    const range: ParsedRange = {
      text: '25/04/2021',
      range: RangeType.day,
      originalRange: defaultRange,
      previousRange: defaultRange,
    }

    const lighthouse: LighthouseData = {
      performance: {
        title: 'Performance',
        value: 75,
        rate: Rate.neutral,
      },
      accessibility: {
        title: 'accessibility',
        value: 75,
        rate: Rate.neutral,
      },
      'best-practices': {
        title: 'best-practices',
        value: 75,
        rate: Rate.neutral,
      },
      seo: {
        title: 'seo',
        value: 75,
        rate: Rate.neutral,
      },
      pwa: {
        title: 'seo',
        value: 75,
        rate: Rate.neutral,
      },
    }

    await main(analytics, range, lighthouse, radiatorConfigFixture)

    expect(buildMessage.buildMessage).toHaveBeenCalledTimes(1)
    expect(sendMessage.sendMessage).toHaveBeenCalledTimes(1)
  })
})

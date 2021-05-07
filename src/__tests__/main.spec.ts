import { Emoji, Rate } from 'enums'
import * as getAnalyticsData from 'integrations/analytics'
import * as getLighthouseData from 'integrations/lighthouse'
import * as sendMessageToSlack from 'integrations/slack'
import * as sendMessageToTelegram from 'integrations/telegram'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import * as logger from 'logger'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

import main from '../main'

describe('Radiator main', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(getAnalyticsData, 'default').mockImplementation(() => Promise.resolve(analytics))
    jest.spyOn(getLighthouseData, 'default').mockImplementation(() => Promise.resolve(lighthouse))
    jest.spyOn(sendMessageToSlack, 'default').mockImplementation(() => Promise.resolve())
    jest.spyOn(sendMessageToTelegram, 'default').mockImplementation(() => Promise.resolve())
    jest.spyOn(logger, 'info').mockImplementation(() => undefined)
    jest.spyOn(logger, 'success').mockImplementation(() => undefined)
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never)
  })

  it('should correctly called with default config', async () => {
    await main(radiatorConfigFixture)

    expect(getAnalyticsData.default).toHaveBeenCalledTimes(1)
    expect(getLighthouseData.default).toHaveBeenCalledTimes(1)
    expect(sendMessageToSlack.default).toHaveBeenCalledTimes(1)
    expect(sendMessageToTelegram.default).toHaveBeenCalledTimes(1)
    expect(logger.info).toHaveBeenCalledTimes(5)
    expect(logger.success).toHaveBeenCalledTimes(2)
    expect(process.exit).toHaveBeenCalledTimes(1)
  })

  it('should correctly called with slack=false and telegram=false', async () => {
    await main({
      ...radiatorConfigFixture,
      slack: false,
      telegram: false,
    })

    expect(getAnalyticsData.default).toHaveBeenCalledTimes(1)
    expect(getLighthouseData.default).toHaveBeenCalledTimes(1)
    expect(sendMessageToSlack.default).not.toHaveBeenCalled()
    expect(sendMessageToTelegram.default).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledTimes(3)
    expect(logger.success).not.toHaveBeenCalled()
    expect(process.exit).toHaveBeenCalledTimes(1)
  })
})

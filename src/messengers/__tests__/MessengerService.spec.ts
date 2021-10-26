import { analyticsData } from '__tests__/fixtures/analyticsData'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { MessengersParams } from 'interfaces'
import { Logger } from 'logger'
import { MessengersService } from 'messengers/MessengersService'
import { Slack } from 'messengers/Slack'
import { Telegram } from 'messengers/Telegram'

import { defaultMessengersParams } from '../../__tests__/fixtures/defaultMessengersParams'

jest.mock('messengers/Slack')
jest.mock('messengers/Telegram')
jest.mock('logger/Logger')

const MockedSlack = Slack as jest.Mock<Slack>
const MockedTG = Telegram as jest.Mock<Telegram>
// @ts-ignore
const MockedLogger = Logger as jest.mock<Logger>

describe('Messengers service', () => {
  let config: MessengersParams

  beforeEach(() => {
    config = { ...defaultMessengersParams }
    MockedSlack.mockClear()
    MockedTG.mockClear()
    MockedLogger.mockClear()
  })

  it('should correctly created service without Slack/TG instances', () => {
    config.slackWebhookUrl = ''
    config.telegramToken = ''
    const service = new MessengersService(config)

    expect(Slack).toHaveBeenCalledTimes(1)
    expect(Telegram).toHaveBeenCalledTimes(1)
    expect(service.sendMessages).toBeTruthy()
  })

  it('should correctly called slack sendMessage method', () => {
    config.slackWebhookUrl = 'test'
    config.telegramToken = ''
    const service = new MessengersService(config)

    const buildMessageData = {
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    }

    service.sendMessages(buildMessageData)

    const mockSlackInstance = MockedSlack.mock.instances[0]
    expect(mockSlackInstance.sendMessage).toHaveBeenCalledTimes(1)
  })

  it('should correctly called slack sendMessage method and got error', () => {
    config.slackWebhookUrl = 'test'
    config.telegramToken = ''

    const buildMessageData = {
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    }

    const sendMessage = jest.fn(() => {
      throw new Error('err')
    })

    // @ts-ignore
    MockedSlack.mockImplementation(() => ({
      sendMessage,
    }))

    const service = new MessengersService(config)
    service.sendMessages(buildMessageData)

    expect(MockedLogger.error).toHaveBeenCalledTimes(1)
  })

  it('should correctly called tg sendMessage method', () => {
    config.slackWebhookUrl = ''
    config.telegramToken = 'test'

    const buildMessageData = {
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    }

    const service = new MessengersService(config)

    service.sendMessages(buildMessageData)

    const mockTgInstance = MockedTG.mock.instances[0]
    expect(mockTgInstance.sendMessage).toHaveBeenCalledTimes(1)
  })

  it('should correctly called tg sendMessage method and got error', () => {
    config.slackWebhookUrl = ''
    config.telegramToken = 'test'

    const buildMessageData = {
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    }

    const sendMessage = jest.fn(() => {
      throw new Error('err')
    })

    // @ts-ignore
    MockedTG.mockImplementation(() => ({
      sendMessage,
    }))

    const service = new MessengersService(config)
    service.sendMessages(buildMessageData)

    expect(MockedLogger.error).toHaveBeenCalledTimes(2)
  })
})

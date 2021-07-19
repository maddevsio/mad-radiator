import { analyticsData } from '__tests__/fixtures/analyticsData'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { RadiatorConfig } from 'interfaces'
import { Slack } from 'messengers/Slack'
import { Telegram } from 'messengers/Telegram'
import { MessengersService } from 'services/Messengers.service'

jest.mock('messengers/Slack')
jest.mock('messengers/Telegram')

const MockedSlack = Slack as jest.Mock<Slack>
const MockedTG = Telegram as jest.Mock<Telegram>

describe('Messengers service', () => {
  let config: RadiatorConfig

  beforeEach(() => {
    config = { ...defaultConfig }
    MockedSlack.mockClear()
    MockedTG.mockClear()
  })

  it('should correctly created service without Slack/TG instances', () => {
    config.slack = false
    config.telegram = false
    const service = new MessengersService(config)

    expect(Slack).toHaveBeenCalledTimes(0)
    expect(Telegram).toHaveBeenCalledTimes(0)
    expect(service.send).toBeTruthy()
  })

  it('should correctly created service and Slack/TG instances', () => {
    const service = new MessengersService(config)

    expect(Slack).toHaveBeenCalledTimes(1)
    expect(Telegram).toHaveBeenCalledTimes(1)
    expect(service.send).toBeTruthy()
  })

  it('should correctly called slack sendMessage method', () => {
    config.slack = true
    config.telegram = false
    const service = new MessengersService(config)

    service.send(analyticsData, lighthouseData, parsedRange)

    const mockSlackInstance = MockedSlack.mock.instances[0]
    expect(mockSlackInstance.sendMessage).toHaveBeenCalledTimes(1)
  })

  it('should correctly called tg sendMessage method', () => {
    config.slack = false
    config.telegram = true
    const service = new MessengersService(config)

    service.send(analyticsData, lighthouseData, parsedRange)

    const mockTgInstance = MockedTG.mock.instances[0]
    expect(mockTgInstance.sendMessage).toHaveBeenCalledTimes(1)
  })
})

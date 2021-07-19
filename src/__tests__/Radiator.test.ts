/* eslint-disable max-classes-per-file */
import { Radiator } from 'Radiator'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { AnalyticsService } from 'services/Analytics.service'
import { LighthouseService } from 'services/Lighthouse.service'
import { MessengersService } from 'services/Messengers.service'
import { SchedulerService } from 'services/Scheduler.service'

jest.mock('services/Analytics.service')
jest.mock('services/Lighthouse.service')
jest.mock('services/Logger.service')
jest.mock('services/Messengers.service')
jest.mock('services/Scheduler.service')

const MockedAnalytics = AnalyticsService as jest.Mock<AnalyticsService>
const MockedLighthouse = LighthouseService as jest.Mock<LighthouseService>
const MockedMessengers = MessengersService as jest.Mock<MessengersService>
const MockedScheduler = SchedulerService as jest.Mock<SchedulerService>

// @ts-ignore
MockedScheduler.mockImplementation(() => ({
  scheduleJob(callback: (...args: any[]) => void) {
    callback()
  },
}))

describe('Radiator', () => {
  beforeEach(() => {
    MockedAnalytics.mockClear()
    MockedLighthouse.mockClear()
    MockedMessengers.mockClear()
    MockedScheduler.mockClear()
  })

  it('should correctly create an instance', () => {
    const radiator = new Radiator(defaultConfig)

    expect(MockedAnalytics).toHaveBeenCalledTimes(1)
    expect(MockedLighthouse).toHaveBeenCalledTimes(1)
    expect(MockedMessengers).toHaveBeenCalledTimes(1)
    expect(MockedScheduler).toHaveBeenCalledTimes(1)

    expect(radiator.run).toBeTruthy()
  })

  it('should correctly called run', async () => {
    const radiator = new Radiator({
      ...defaultConfig,
      schedule: undefined,
    })

    const analyticsInstance = MockedAnalytics.mock.instances[0]
    const lighthouseInstance = MockedLighthouse.mock.instances[0]
    const messengersInstance = MockedMessengers.mock.instances[0]

    await radiator.run()

    expect(analyticsInstance.getData).toHaveBeenCalledTimes(1)
    expect(lighthouseInstance.getData).toHaveBeenCalledTimes(1)
    expect(messengersInstance.send).toHaveBeenCalledTimes(1)
  })
})

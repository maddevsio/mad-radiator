/* eslint-disable max-classes-per-file */
import { Radiator } from 'Radiator'
import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { AnalyticsService } from 'analytics/AnalyticsService'
import { ChartService } from 'services/Chart.service'
import { GoogleAuthService } from 'services/GoogleAuth.service'
import { LighthouseService } from 'services/Lighthouse.service'
import { MessengersService } from 'services/Messengers.service'
import { SchedulerService } from 'services/Scheduler.service'
import { StorageService } from 'services/Storage.service'

jest.mock('analytics/AnalyticsService')
jest.mock('services/Lighthouse.service')
jest.mock('services/Logger.service')
jest.mock('services/Messengers.service')
jest.mock('services/Scheduler.service')
jest.mock('services/GoogleAuth.service')
jest.mock('services/Chart.service')
jest.mock('services/Storage.service')

const MockedAnalytics = AnalyticsService as jest.Mock<AnalyticsService>
const MockedLighthouse = LighthouseService as jest.Mock<LighthouseService>
const MockedMessengers = MessengersService as jest.Mock<MessengersService>
const MockedScheduler = SchedulerService as jest.Mock<SchedulerService>
const MockedGoogleAuth = GoogleAuthService as jest.Mock<GoogleAuthService>
// @ts-ignore
const MockedChart = ChartService as jest.Mock<ChartService>
// @ts-ignore
const MockedStorage = StorageService as jest.Mock<StorageService>

describe('Radiator', () => {
  let scheduleJob = jest.fn()
  let unlink = jest.fn()
  let getData = jest.fn()
  let renderChart = jest.fn()
  let storeFile = jest.fn()

  beforeEach(() => {
    MockedAnalytics.mockClear()
    MockedLighthouse.mockClear()
    MockedMessengers.mockClear()
    MockedScheduler.mockClear()
    MockedGoogleAuth.mockClear()
    MockedChart.mockClear()
    MockedStorage.mockClear()

    scheduleJob = jest.fn((callback: (...args: any[]) => void) => {
      callback()
    })

    getData = jest.fn(async () => analyticsData)

    unlink = jest.fn()

    renderChart = jest.fn(async () => 'buffer')

    storeFile = jest.fn(async () => 'success')

    // @ts-ignore
    MockedScheduler.mockImplementation(() => ({
      scheduleJob,
    }))

    // @ts-ignore
    MockedAnalytics.mockImplementation(() => ({
      getData,
    }))

    // @ts-ignore
    MockedGoogleAuth.mockImplementation(() => ({
      authorize() {
        return {
          unlink,
        }
      },
    }))

    // @ts-ignore
    MockedChart.mockImplementation(() => ({
      renderChart,
    }))

    // @ts-ignore
    MockedStorage.mockImplementation(() => ({
      storeFile,
    }))
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

    const lighthouseInstance = MockedLighthouse.mock.instances[0]
    const messengersInstance = MockedMessengers.mock.instances[0]

    await radiator.run()

    expect(getData).toHaveBeenCalledTimes(1)
    expect(lighthouseInstance.getData).toHaveBeenCalledTimes(1)
    expect(messengersInstance.send).toHaveBeenCalledTimes(1)
    expect(unlink).toHaveBeenCalledTimes(1)
    expect(renderChart).toHaveBeenCalledTimes(1)
    expect(storeFile).toHaveBeenCalledTimes(1)
  })

  it('should correctly called run without charts', async () => {
    // @ts-ignore
    MockedAnalytics.mockImplementation(() => ({
      getData: () => ({ ...analyticsData, chart: undefined }),
    }))

    const radiator = new Radiator({
      ...defaultConfig,
      schedule: undefined,
      chart: undefined,
    })

    await radiator.run()
    expect(renderChart).toHaveBeenCalledTimes(0)
    expect(storeFile).toHaveBeenCalledTimes(0)
  })
})

/* eslint-disable max-classes-per-file */
import * as Sentry from '@sentry/node'
import { Radiator } from 'Radiator'
import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { AnalyticsService } from 'analytics'
import { GoogleAuthorization } from 'authorization'
import { ChartBuilder } from 'chartBuilder'
import { AuthorizationError } from 'errors/types/AuthorizationError'
import { Lighthouse } from 'lighthouse'
import { MessengersService } from 'messengers'
import { PageAnalytics } from 'pagesAnalytics'
import { QuoraService } from 'quora'
import { Scheduler } from 'scheduler'
import { GoogleDriveStorage } from 'storage'

import { defaultAnalyticsParams } from './fixtures/defaultAnalyticsParams'
import { defaultLighthouseParams } from './fixtures/defaultLighthouseParams'
import { defaultMessengersParams } from './fixtures/defaultMessengersParams'

jest.mock('analytics/AnalyticsService')
jest.mock('chartBuilder/ChartBuilder')
jest.mock('authorization/GoogleAuthorization')
jest.mock('lighthouse/Lighthouse')
jest.mock('messengers/MessengersService')
jest.mock('scheduler/Scheduler')
jest.mock('storage/GoogleDriveStorage')
jest.mock('@sentry/node')
jest.mock('quora/QuoraService')
jest.mock('pagesAnalytics/PageAnalytics')
jest.mock('@sentry/node', () => (
  {
    init: jest.fn(),
    captureException: jest.fn(),
  }
))

jest.mock('moment', () => () => ({
  tz: () => ({
    subtract: () => ({
      format: () => '25/4/2021',
    }),
  }),
  subtract: () => ({
    format: () => '25/4/2021',
  }),
}))

jest.mock('moment-timezone', () => () => ({
  tz: () => ({
    subtract: () => ({
      format: () => '25/4/2021',
    }),
  }),
  subtract: () => ({
    format: () => '25/4/2021',
  }),
}))

const MockedAnalytics = AnalyticsService as jest.Mock<AnalyticsService>
// @ts-ignore
const MockedLighthouse = Lighthouse as jest.Mock<Lighthouse>
const MockedMessengers = MessengersService as jest.Mock<MessengersService>
const MockedScheduler = Scheduler as jest.Mock<Scheduler>
const MockedGoogleAuth = GoogleAuthorization as jest.Mock<GoogleAuthorization>
// @ts-ignore
const MockedChart = ChartBuilder as jest.Mock<ChartBuilder>
// @ts-ignore
const MockedStorage = GoogleDriveStorage as jest.Mock<GoogleDriveStorage>
// @ts-ignore
const MockedQuora = QuoraService as jest.Mock<QuoraService>
// @ts-ignore
const MockedPageAnalytics = PageAnalytics as jest.Mock<PageAnalytics>

describe('Radiator', () => {
  jest.spyOn(console, 'log').mockImplementation(() => { })

  let scheduleJob = jest.fn()
  let unlink = jest.fn()
  let getData = jest.fn()
  let renderChart = jest.fn()
  let storeFile = jest.fn()
  let setCountOfQuoraPosts = jest.fn()
  let getPageAnalyticsMetrics = jest.fn()

  beforeEach(() => {
    MockedAnalytics.mockClear()
    MockedLighthouse.mockClear()
    MockedMessengers.mockClear()
    MockedScheduler.mockClear()
    MockedGoogleAuth.mockClear()
    MockedChart.mockClear()
    MockedStorage.mockClear()
    MockedQuora.mockClear()
    MockedPageAnalytics.mockClear()

    scheduleJob = jest.fn((callback: (...args: any[]) => void) => {
      callback()
    })

    unlink = jest.fn()

    getData = jest.fn(async () => analyticsData)
    setCountOfQuoraPosts = jest.fn(async () => 1)
    getPageAnalyticsMetrics = jest.fn(async () => [])

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
    MockedChart.mockImplementation(() => ({
      renderChart,
    }))

    // @ts-ignore
    MockedQuora.mockImplementation(() => ({
      setCountOfQuoraPosts,
    }))

    // @ts-ignore
    MockedStorage.mockImplementation(() => ({
      storeFile,
    }))

    // @ts-ignore
    MockedPageAnalytics.mockImplementation(() => ({
      getPageAnalyticsMetrics,
    }))

    // @ts-ignore
    MockedGoogleAuth.mockImplementation(() => ({
      authorize() {
        return {
          unlink,
        }
      },
    }))
  })

  it('should correctly create an instance', () => {
    const radiator = new Radiator(defaultConfig)
    expect(MockedGoogleAuth).toHaveBeenCalledTimes(1)
    expect(radiator.run).toBeTruthy()
  })

  it('should correctly called run', async () => {

    const radiator = new Radiator(defaultConfig)
    radiator.useSentry({
      sentryDSN: 'test',
      tracesSampleRate: 1.0,
    })
    radiator.useAnalytics(defaultAnalyticsParams)
    radiator.useLighthouse(defaultLighthouseParams)
    radiator.useSlack(defaultMessengersParams)
    radiator.usePageAnalytics({ urlTestRegexp: '/blog/', websiteUrl: 'maddevs.io' }, 'test.xml')
    radiator.useTelegram(defaultMessengersParams)
    radiator.useQuoraService({ quoraUserID: 'test' }, 'test')
    radiator.scheduleJob({
      period: 'day',
      time: 10,
    })

    const lighthouseInstance = MockedLighthouse.mock.instances[0]

    await radiator.run()
    expect(Sentry.init).toHaveBeenCalledTimes(2)
    expect(getData).toHaveBeenCalledTimes(2)
    expect(lighthouseInstance.getLighthouseMetrics).toHaveBeenCalledTimes(2)
    expect(setCountOfQuoraPosts).toHaveBeenCalledTimes(2)
    expect(getPageAnalyticsMetrics).toHaveBeenCalledTimes(2)
    expect(unlink).toHaveBeenCalledTimes(2)
  })

  it('should correctly called run without charts', async () => {
    // @ts-ignore
    MockedAnalytics.mockImplementation(() => ({
      getData: () => ({ ...analyticsData, chart: undefined }),
    }))

    const radiator = new Radiator(defaultConfig)
    radiator.useAnalytics({ ...defaultAnalyticsParams, chart: undefined })

    await radiator.run()
    expect(renderChart).toHaveBeenCalledTimes(0)
    expect(storeFile).toHaveBeenCalledTimes(0)
  })

  it('should correctly called handleRadiatorError', async () => {
    // @ts-ignore
    MockedAnalytics.mockImplementation(() => ({
      getData: () => Promise.reject(new AuthorizationError('api error'))
    }))

    const radiator = new Radiator(defaultConfig)
    radiator.useAnalytics(defaultAnalyticsParams)
    await radiator.run()

    expect(Sentry.captureException).toHaveBeenCalledTimes(0)
  })
})


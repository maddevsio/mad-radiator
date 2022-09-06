/* eslint-disable */
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { AnalyticsService } from 'analytics'
import { GoogleAuthorization } from 'authorization'
import { MessengersService } from 'messengers'
import { Scheduler } from 'scheduler'
import { PageAnalyticsService } from '../pagesAnalytics'
import { QuoraService } from '../quora'
import { SentryService } from 'sentry/sentryService'
import { defaultAnalyticsParams } from './fixtures/defaultAnalyticsParams'
import { defaultMessengersParams } from './fixtures/defaultMessengersParams'
import { FirestoreData } from '../quora/interfaces'
import { Radiator } from '../Radiator'
import { RedditCountPostsService } from '../redditPosts'
import { analyticsData } from './fixtures/analyticsData'

jest.mock('authorization/GoogleAuthorization')
jest.mock('@sentry/node', () => (
  {
    init: jest.fn(),
    captureException: jest.fn(),
  }
))
jest.mock('analytics/AnalyticsService', () => ({
  AnalyticsService: jest.fn().mockImplementation(() => ({
    getName: jest.fn(() => 'AnalyticsService'),
    perform: jest.fn(),
    getData: jest.fn(async () => analyticsData)
  }))
}))
jest.mock('authorization/GoogleAuthorization', () => ({
  GoogleAuthorization: jest.fn().mockImplementation(() => ({
    authorize() {
      return {
        unlink: jest.fn(),
      }
    },
  }))
}))
jest.mock('messengers/MessengersService', () => ({
  MessengersService: jest.fn().mockImplementation(() => ({
    sendMessages: jest.fn().mockImplementation(() => {})
  }))
}))
jest.mock('scheduler/Scheduler', () => ({
  Scheduler: jest.fn().mockImplementation(() => ({
    scheduleJob: jest.fn((callback: (...args: any[]) => void) => {
      callback()
    })
  }))
}))
jest.mock('sentry/sentryService', () => ({
  SentryService: jest.fn().mockImplementation(() => ({
    sendErrorToSentry: jest.fn(),
  }))
}))
jest.mock('quora/QuoraService')
jest.mock('pagesAnalytics/PageAnalyticsService')
jest.mock('redditPosts/RedditCountPostsService')

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

const responseFireStoreData: FirestoreData = {
  data: [{
    document: {
      name: 'projects/mad-radiator-e9549/databases/(default)/documents/quora/06FUTXctDClabsVXq5Ti',
      fields: {
        count: {
          integerValue: '3',
        },
      },
      createTime: '2022-06-07T14:05:49.532227Z',
      updateTime: '2022-06-07T14:10:19.836976Z',
    },
    readTime: '2022-06-08T04:55:30.242905Z',
  }],
}

const getDataAfterDate = jest
  .fn()
  .mockImplementation(() => new Promise(res => res(responseFireStoreData)))
const setData = jest.fn().mockImplementation(() => new Promise<void>(res => res()))
jest.mock('utils/firestore', () => ({
  Firestore: jest.fn().mockImplementation(() => ({
    getDataAfterDate,
    setData,
  }))
}))


const MockedAnalytics = AnalyticsService as jest.Mock<AnalyticsService>
const MockedMessengersService = MessengersService as jest.Mock<MessengersService>
const MockedScheduler = Scheduler as jest.Mock<Scheduler>
const MockedGoogleAuth = GoogleAuthorization as jest.Mock<GoogleAuthorization>
const MockedQuora = QuoraService as jest.Mock<QuoraService>
const MockedPageAnalytics = PageAnalyticsService as jest.Mock<PageAnalyticsService>
const MockedReddit = RedditCountPostsService as jest.Mock<RedditCountPostsService>
const MockedSentryService = SentryService as jest.Mock<SentryService>

describe('Radiator', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    MockedAnalytics.mockClear()
    MockedMessengersService.mockClear()
    MockedScheduler.mockClear()
    MockedGoogleAuth.mockClear()
    MockedQuora.mockClear()
    MockedPageAnalytics.mockClear()
    MockedReddit.mockClear()
    MockedSentryService.mockClear()
    const setCountOfQuoraPosts = jest.fn(async () => 1)
    const getPostsCountInReddit = jest.fn(async () => 1)
    const getPageAnalyticsMetrics = jest.fn(async () => [])

    // @ts-ignore
    MockedQuora.mockImplementation(() => ({
      setCountOfQuoraPosts,
    }))

    // @ts-ignore
    MockedReddit.mockImplementation(() => ({
      getPostsCountInReddit,
    }))

    // @ts-ignore
    MockedPageAnalytics.mockImplementation(() => ({
      getPageAnalyticsMetrics,
    }))
    // @ts-ignore
    MockedSentryService.mockImplementation(() => ({
      sendErrorToSentry: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly create an instance', () => {
    // @ts-ignore
    const radiator = new Radiator(defaultConfig, new MessengersService(defaultMessengersParams))
    radiator.execute()
    expect(MockedScheduler).toHaveBeenCalledTimes(1)
    expect(MockedGoogleAuth).toHaveBeenCalledTimes(1)
    expect(radiator.execute()).toBeTruthy()
  })

  it('should correctly work execute', () => {
    const radiator = new Radiator(defaultConfig, new MessengersService(defaultMessengersParams))
    radiator.register(new AnalyticsService(defaultAnalyticsParams, defaultConfig.range))
    radiator.execute()
    expect(MockedScheduler).toHaveBeenCalledTimes(1)
    expect(MockedGoogleAuth).toHaveBeenCalledTimes(1)
    expect(MockedAnalytics).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(radiator.services).toHaveLength(1)
  })

  it('should correctly work catching errors', () => {
    // @ts-ignore
    MockedAnalytics.mockImplementationOnce(() => ({
      getName: jest.fn(() => 'AnalyticsService'),
      perform: jest.fn(() => Promise.reject('Error')),
      getData: jest.fn(async () => analyticsData)
    }))
    const radiator = new Radiator(defaultConfig, new MessengersService(defaultMessengersParams))
    radiator.register(new AnalyticsService(defaultAnalyticsParams, defaultConfig.range))
    radiator.execute()
    expect(MockedSentryService).toHaveBeenCalledTimes(1)
  })
})

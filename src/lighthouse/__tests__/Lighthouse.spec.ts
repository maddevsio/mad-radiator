import axios, { AxiosResponse } from 'axios'
import { Lighthouse } from 'lighthouse/Lighthouse'
import { Sitemap } from 'lighthouse/Sitemap'
import { LighthousePayload } from 'lighthouse/interfaces'

import { LighthouseParams } from '../interfaces'

const responseData: AxiosResponse<LighthousePayload> = {
  data: {
    lighthouseResult: {
      categories: [
        {
          id: 'accessibility',
          title: 'one',
          score: 0.99,
        },
        {
          id: 'best_practices',
          title: 'two',
          score: 0.7,
        },
        {
          id: 'performance',
          title: 'three',
          score: 0.3,
        },
        {
          id: 'pwa',
          title: 'three',
          score: 0.3,
        },
        {
          id: 'seo',
          title: 'three',
          score: 0.3,
        },
      ],
    },
  },
  status: 200,
  statusText: 'success',
  headers: {},
  config: {},
}

jest.mock('lighthouse/Sitemap')
jest.mock('logger/Logger')

const MockedSitemap = Sitemap as jest.Mock<Sitemap>

describe('Lighthouse service', () => {
  let config: LighthouseParams

  const getAllUrls = jest
    .fn()
    .mockImplementation(() => new Promise(res => res(['maddevs.io', 'maddevs.io/blog'])))

  beforeEach(() => {
    MockedSitemap.mockClear()
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(responseData))
    config = {
      'urlTestRegexp': '(\\/blog\\/)|(\\/customer-university\\/)|(\\/ru\\/)[a-zA-Z0-9]{1}',
      'topCount': 3,
      'worstCount': 3,
      'websiteUrl': 'https://maddevs.io',
    }

    // @ts-ignore
    MockedSitemap.mockImplementation(() => ({
      getAllUrls,
    }))
  })

  it('should correctly created service without Slack/TG instances', () => {
    const service = new Lighthouse(config)

    expect(service.getLighthouseMetrics).toBeTruthy()
  })

  it('should correctly called getData method', async () => {
    config = {}
    const service = new Lighthouse(config)

    const data = await service.getLighthouseMetrics()

    expect(data).toEqual({
      average: {
        accessibility: 99,
        best_practices: 70,
        performance: 30,
        pwa: 30,
        seo: 30,
      },
      top: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io',
        },
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io/blog',
        },
      ],
      urlCount: 2,
      worst: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io/blog',
        },
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io',
        },
      ],
    })
    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('should correctly called getData method and catch error from lighthouse', async () => {
    config = {}

    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error('api error')))

    const service = new Lighthouse(config)
    const data = await service.getLighthouseMetrics()

    expect(data).toEqual({
      average: { accessibility: 0, best_practices: 0, performance: 0, pwa: 0, seo: 0 },
      top: [],
      urlCount: 0,
      worst: [],
    })
  })
  it('should correctly called getData method without lighthouse', async () => {
    config.topCount = undefined
    config.worstCount = undefined

    const service = new Lighthouse(config)

    const data = await service.getLighthouseMetrics()

    expect(data).toEqual({
      average: {
        accessibility: 99,
        best_practices: 70,
        performance: 30,
        pwa: 30,
        seo: 30,
      },
      top: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io',
        },
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io/blog',
        },
      ],
      urlCount: 2,
      worst: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io/blog',
        },
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io',
        },
      ],
    })
  })
  it('should correctly called getData method with top and worst', async () => {
    config = {
      topCount: 1,
      worstCount: 1,
    }

    const service = new Lighthouse(config)

    const data = await service.getLighthouseMetrics()

    expect(data).toEqual({
      average: {
        accessibility: 99,
        best_practices: 70,
        performance: 30,
        pwa: 30,
        seo: 30,
      },
      top: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io',
        },
      ],
      urlCount: 2,
      worst: [
        {
          average: 52,
          metrics: {
            accessibility: 99,
            best_practices: 70,
            performance: 30,
            pwa: 30,
            seo: 30,
          },
          url: 'maddevs.io/blog',
        },
      ],
    })
  })
})

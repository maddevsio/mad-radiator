import { Sitemap } from 'sitemap/Sitemap'

import { LighthouseParams } from '../interfaces'

jest.mock('sitemap-stream-parser')

const urls = [
  'https://maddevs.io/',
  'https://maddevs.io/services/',
  'https://maddevs.io/careers/',
  'https://maddevs.io/customer-university/custom-software-development-pricing-strategies/',
  'https://maddevs.io/customer-university/who-are-mad-developers/',
  'https://maddevs.io/customer-university/product-based-vs-service-based-companies/'
]

describe('Sitemap service', () => {
  let config: LighthouseParams

  beforeEach(() => {
    config = {
      'urlTestRegexp': '(\\/blog\\/)|(\\/customer-university\\/)|(\\/ru\\/)[a-zA-Z0-9]{1}',
      'topCount': 3,
      'worstCount': 3,
      'websiteUrl': 'https://maddevs.io',
    }
  })

  it('should correctly created service without', () => {
    const sitemap = new Sitemap(config)

    expect(sitemap.getAllUrls).toBeTruthy()
  })

  it('should correctly return result urls', async () => {
    const sitemap = new Sitemap(config)
    const getAllUrls = jest.spyOn(Sitemap.prototype as any, 'parseSitemapUrls');
    getAllUrls.mockImplementation(() => new Promise(resolve => resolve(urls)));
    const resultUrls = await sitemap.getAllUrls()

    expect(resultUrls).toEqual([
      'https://maddevs.io/',
      'https://maddevs.io/services/',
      'https://maddevs.io/careers/',
    ])
  });
})

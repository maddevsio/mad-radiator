import { Sitemap } from 'lighthouse/Sitemap'
import { LighthouseParams } from 'lighthouse/interfaces'

import { defaultLighthouseParams } from '../../__tests__/fixtures/defaultLighthouseParams'

describe('Sitemap', () => {
  let config: LighthouseParams
  let sitemap: Sitemap
  const urls: Array<string> = [
    'https://maddevs.io/services/',
    'https://maddevs.io/careers/',
    'https://maddevs.io/ru/careers/',
    'https://maddevs.io/blog/'
  ];

  beforeEach(() => {
    config = {
      ...defaultLighthouseParams,
    }
    sitemap = new Sitemap(config);
  })

  const parseSitemapUrlsMock = jest.spyOn(Sitemap.prototype as any, 'parseSitemapUrls');
  parseSitemapUrlsMock.mockImplementation(() => new Promise(res => res(urls)));

  it('should correctly return an instance', () => {
    expect(sitemap.getAllUrls).toBeTruthy()
  })

  it('should the getAllUrls method return urls', async () => {
    const allUrls = await sitemap.getAllUrls();

    expect(allUrls).toEqual(urls);
  })

  it('should the getAllUrls method return urls filtered by the regexp', async () => {
    config.urlTestRegexp = '(\\/blog\\/)|(\\/customer-university\\/)|(\\/ru\\/)[a-zA-Z0-9]{1}';
    const allUrls = await sitemap.getAllUrls();

    expect(allUrls).toEqual(['https://maddevs.io/services/', 'https://maddevs.io/careers/']);
  })
})

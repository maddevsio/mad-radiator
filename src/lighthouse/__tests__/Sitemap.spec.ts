import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import axios from 'axios'
import { Sitemap } from 'lighthouse/Sitemap'

describe('Sitemap', () => {
  let config = defaultConfig

  beforeEach(() => {
    config = {
      ...defaultConfig,
    }
  })

  it('should correctly return an instance', () => {
    const sitemap = new Sitemap(config)

    expect(sitemap.getAllUrls).toBeTruthy()
  })

  it('should getAllUrls method return all urls', async () => {
    const resultString = `
      <sitemap>
        <url><loc>maddevs.io</loc></url>
        <url><loc>google.com</loc></url>
       </sitemap>
    `
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise(res =>
          res({
            data: resultString,
          }),
        ),
    )
    const sitemap = new Sitemap(config)

    const urls = await sitemap.getAllUrls()

    expect(urls).toEqual(['maddevs.io', 'google.com'])
  })

  it('should getAllUrls method return correct filtered urls', async () => {
    const resultString = `
      <sitemap>
        <url><loc>https://maddevs.io</loc></url>
        <url><loc>https://maddevs.io/test</loc></url>
        <url><loc>https://maddevs.io/blog/123</loc></url>
        <url><loc>https://maddevs.io/customer-university/123</loc></url>
       </sitemap>
    `

    config.lighthouse = {
      urlTestRegexp: '(\\/blog\\/)|(\\/customer-university\\/)[a-zA-Z0-9]{1}',
    }

    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise(res =>
          res({
            data: resultString,
          }),
        ),
    )
    const sitemap = new Sitemap(config)

    const urls = await sitemap.getAllUrls()

    expect(urls).toEqual(['https://maddevs.io', 'https://maddevs.io/test'])
  })
})

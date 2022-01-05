import axios from 'axios'
import { XmlParser } from 'lighthouse/XmlParser'

import { LighthouseParams } from './interfaces'

export class Sitemap {
  private readonly config: LighthouseParams

  constructor(config: LighthouseParams) {
    this.config = config
  }

  public async getAllUrls(): Promise<Array<string>> {
    const url = this.buildSitemapUrl()

    const { data: xml } = await axios.get<string>(url)

    const urls = XmlParser.parseTags(xml, 'loc')

    if (!this.config?.urlTestRegexp) return urls

    const regexp = new RegExp(this.config.urlTestRegexp)
    return urls.filter(urlToTest => !regexp.test(urlToTest))
  }

  private buildSitemapUrl(): string {
    const correctUrl = this.config.websiteUrl?.replace(/\/?$/gm, '');
    return `${correctUrl}/sitemap.xml`
  }
}

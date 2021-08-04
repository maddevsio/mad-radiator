import axios from 'axios'
import { RadiatorConfig } from 'interfaces'
import { XmlParser } from 'lighthouse/XmlParser'

export class Sitemap {
  private readonly config: RadiatorConfig

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  public async getAllUrls(): Promise<Array<string>> {
    const url = this.buildSitemapUrl()

    const { data: xml } = await axios.get<string>(url)

    const urls = XmlParser.parseTags(xml, 'loc')

    if (!this.config.lighthouse?.urlTestRegexp) return urls

    const regexp = new RegExp(this.config.lighthouse.urlTestRegexp)
    return urls.filter(urlToTest => !regexp.test(urlToTest))
  }

  private buildSitemapUrl(): string {
    return `${this.config.websiteUrl}/sitemap.xml`
  }
}

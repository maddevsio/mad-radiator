/// <reference path="../../@types/sitemap-stream-parser.d.ts"/>
import { parseSitemaps } from 'sitemap-stream-parser';

import { LighthouseParams } from './interfaces'

export class Sitemap {
  private readonly config: LighthouseParams

  constructor(config: LighthouseParams) {
    this.config = config
  }

  public async getAllUrls() {
    const url = this.buildSitemapUrl()
    const parsedUrls: Array<string> = await this.parseSitemapUrls(url);

    return this.filterByRegexp(parsedUrls);
  }

  private buildSitemapUrl() {
    return `${this.config.websiteUrl?.replace(/\/?$/gm, '')}/'sitemap.xml'`
  }

  private parseSitemapUrls(link: string) {
    return new Promise<Array<string>>(resolve => {
      const parsedUrls: Array<string> = [];

      parseSitemaps(
        link,
        (xml: string) => parsedUrls.push(xml),
        () => resolve(parsedUrls)
      );
    })
  }

  private filterByRegexp(parsedUrls: Array<string>) {
    if (!this.config?.urlTestRegexp) return parsedUrls
    const regexp = new RegExp(this.config.urlTestRegexp)
    return parsedUrls.filter(urlToTest => !regexp.test(urlToTest))
  }
}

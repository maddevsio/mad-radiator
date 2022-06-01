// import { Sitemap } from 'lighthouse/Sitemap'
import { Logger } from 'logger'

import { Firestore } from "../utils/firestore"

// import { Blog } from './interfaces'

export class PageAnalytics {
  // private readonly config: Blog

  // private readonly sitemap: Sitemap

  private firestore: Firestore

  constructor() {
    this.firestore = new Firestore()
    // this.sitemap = new Sitemap(this.config)
  }

  public async getPageAnalyticsMetrics(): Promise<any> {

    // const urls = await this.sitemap.getAllUrls()
    // console.log('urls', urls)
    // console.log('count', urls.length)
    // console.log('config', this.config)

    Logger.info(`Start getting data from firestore`)
      const filed = {
        fields: {
          count: { stringValue: '888' },
        }
      }
    // const { data } = await axios.post(PageAnalytics.url, filed)
    const { data } = await this.firestore.setData('blog', filed)
    console.log('set field data')
    console.dir(data, { depth: null, maxArrayLength: null });
    console.log('\n')
    // const res = await axios.get(PageAnalytics.url)
    const res = await this.firestore.getData('blog', )
    console.log('res data')
    console.dir(res.data, { depth: null, maxArrayLength: null })
  }

}

import { Logger } from 'logger'
import moment from 'moment'
import { Sitemap } from 'sitemap/Sitemap'

import { Firestore } from '../utils/firestore'
import { getMonthName } from '../utils/getMonthName'

import { PagesParams } from './interfaces'


export class NewPagesInSite {
    private readonly config: PagesParams

    private readonly sitemap: Sitemap

    private firestore: Firestore

    private currentCount: number

    private readonly firestoreCollectionId: string = 'pages'

    constructor(config: PagesParams) {
        this.config = config
        this.sitemap = new Sitemap(this.config)
        this.firestore = new Firestore()
        this.currentCount = 0
    }

    public async setCountOfBlogPages(): Promise<any> {
        Logger.info('Start getting pages links from sitemap')
        const urls = await this.sitemap.getAllUrls()
        if (urls.length === 0) Logger.error('Something went wrong')
        this.currentCount = urls.length
        Logger.success(`Count of links from sitemap: ${urls.length}`)
        Logger.info(`Saving count of links on firestore...`)
        await this.firestore.setData(this.firestoreCollectionId, {
            fields: {
                count: { integerValue: urls.length },
                created: { timestampValue: new Date().toISOString() }
            }
        })
        Logger.success('Count saved!')
        return this.getNewPagesAnalyticsMetrics()
    }

    public async getNewPagesAnalyticsMetrics(): Promise<number> {
        Logger.info(`Start getting pages data from firestore`)
        const firstDayOfCurrentMonth = moment().startOf('month').toISOString()
        const { data } = await this.firestore.getDataAfterDate(firstDayOfCurrentMonth, 1, this.firestoreCollectionId)
        const oldCount = data[0].document?.fields?.count?.integerValue
        Logger.info(`Новых страниц за ${getMonthName()}: ${this.currentCount - oldCount}`)
        return this.currentCount - oldCount
    }
}

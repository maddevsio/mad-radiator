import { Logger } from 'logger'
import { Sitemap } from 'sitemap/Sitemap'

import { Firestore } from '../utils/firestore'
import { getFirstDayOfCurrentMonth } from '../utils/getFirstDayOfCurrentMonth'

import { PagesParams } from './interfaces'

export class NewPagesInSite {
    private readonly config: PagesParams

    private readonly sitemap: Sitemap

    private firestore: Firestore

    private currentCount: number

    private readonly firestoreCollectionId: string = 'pages'

    constructor(config: PagesParams, firestoreId: string) {
        this.config = config
        this.sitemap = new Sitemap(this.config)
        this.firestore = new Firestore(firestoreId)
        this.currentCount = 0
    }

    public async setCountOfNewPages(): Promise<number> {
        Logger.info('Start getting pages links from sitemap')
        const urls = await this.sitemap.getAllUrls()
        if (urls.length === 0) {
            throw new Error('Sitemap is empty! Metric not collected!')
        }
        this.currentCount = urls.length
        Logger.success(`Count of links from sitemap: ${urls.length}`)
        await this.firestore.setData(this.firestoreCollectionId, {
            fields: {
                count: { integerValue: urls.length },
                created: { timestampValue: new Date().toISOString() }
            }
        })
        return this.getNewPagesAnalyticsMetrics()
    }

    public async getNewPagesAnalyticsMetrics(): Promise<number> {
        Logger.info(`Start getting pages data from firestore`)
        const { data } = await this.firestore.getDataAfterDate(getFirstDayOfCurrentMonth(), this.firestoreCollectionId, 1)
        const [firstPageInCurrentMonth] = data
        const oldCount = (firstPageInCurrentMonth.document?.fields?.count?.integerValue || 0)
        return this.currentCount - oldCount
    }
}
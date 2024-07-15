/* eslint-disable */
import axios from 'axios'
import { GlassdoorError } from 'errors/types/GlassdoorError'
import admin from 'firebase-admin'
import { FirestoreConfig } from 'interfaces'
import { Firestore } from 'utils/firestore'
import { getFirstDayOfCurrentMonth } from 'utils/getFirstDayOfCurrentMonth'
import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'

import { GlassdoorParams } from './interfaces/GlassdoorParams'

export class GlassdoorService implements RadiatorService {
  glassdoorUrl: string
  api_key: string
  private firestore: Firestore
  private readonly fireStoreDir: string = 'glassdoor'
  private currentCount: number

  constructor(glassdoorConfig: GlassdoorParams, firestoreConfig: FirestoreConfig) {
    this.firestore = new Firestore(firestoreConfig)
    this.currentCount = 0
    this.glassdoorUrl = glassdoorConfig.glassdoorUrl
    this.api_key = glassdoorConfig.api_key
  }

  public async setCountOfGlassdoorReviews(): Promise<any> {
    try {
      const reviews = await this.getReviewsFromGlassdoor(this.api_key, this.glassdoorUrl)
      this.currentCount = reviews
      await this.firestore.setData(this.fireStoreDir, {
        count: reviews,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      })
      return await this.getGlassdoorReviewsMetrics()
    } catch (error: any) {
      return new GlassdoorError(error)
    }
  }

  public getName(): string {
    return this.constructor.name
  }

  async perform(
    results: BuildMessageDataSpec,
    _radiator: RadiatorSpec,
  ): Promise<BuildMessageDataSpec> {
    return Object.assign(results, {
      glassdoorReviews: await executeWithRetry(
        `${this.getName()}.setCountOfGlassdoorReviews()`,
        5,
        1500,
        () => this.setCountOfGlassdoorReviews(),
        (error: any) => error,
      ),
    })
  }

  private async getReviewsFromGlassdoor(api_key: string, glassdoorUrl: string) {
    const apiUrl = 'https://www.page2api.com/api/v1/scrape'
    const payload = {
      api_key,
      url: glassdoorUrl,
      real_browser: true,
      premium_proxy: 'us',
      parse: {
        reviews: '*',
      },
    }

    try {
      console.info(
        `getReviewsFromGlassdoor: POST apiUrl: "${apiUrl}"; payload: "${JSON.stringify(payload)}";`,
      )
      const { data, status } = await axios.post(apiUrl, payload)
      console.info(`getReviewsFromGlassdoor: POST success: status ${status}`)
      const source = data.result.reviews
      /* eslint-disable no-useless-escape */
      const regexp = /\"ratingCount\"\s\:\s\"(\d+)/
      const match = source.match(regexp)
      if (!match) {
        console.error(`getReviewsFromGlassdoor: No match found in "source".`)
        throw new Error('getReviewsFromGlassdoor: no match')
      }
      if (!match[1]) {
        console.error(`getReviewsFromGlassdoor: No match[1] found in "source".`)
        throw new Error('getReviewsFromGlassdoor: no match[1].')
      }
      const reviews = match[1]
      console.info(`getReviewsFromGlassdoor: reviews: ${reviews}`)
      return Number(reviews)
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }

  private async getGlassdoorReviewsMetrics(): Promise<number> {
    const oldCount = await this.firestore.getDataAfterDate(
      getFirstDayOfCurrentMonth(),
      this.fireStoreDir,
      1,
    )
    const currentCount = this.currentCount - oldCount
    return currentCount < 0 ? 0 : currentCount
  }
}

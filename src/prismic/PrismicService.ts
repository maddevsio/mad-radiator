import * as prismic from "@prismicio/client"
import moment from "moment"
import { BlogQueryResponse, IPrismicService } from "./interfaces"

/* It should be imported this way because package doesn't support ESM import. And the newest package version doesn't support CommonJS.
Because in build all typescript is converted to javascript and imports transpiled to require, we should keep it this way. */

const fetch = require('node-fetch')

export class PrismicService implements IPrismicService {
  client: prismic.Client

  private readonly repositoryName = 'superpupertest'

  pageSize = 100

  constructor() {
    this.client = prismic.createClient(this.repositoryName, { fetch })
  }

  async getBlogPagesForMonth(): Promise<BlogQueryResponse> {
    const currentMonth = moment().month() + 1
    const currentYear = moment().year()

    try {
      return await this.client.get({
          predicates: [
          prismic.predicate.at('document.type', 'post'),
          prismic.predicate.dateYear('document.first_publication_date', Number(currentYear)),
          prismic.predicate.dateMonth('document.first_publication_date', Number(currentMonth))],
          pageSize: this.pageSize,
    })
    } catch (error: any) {
      return error
    }
  }

  async getBlogPagesForWeek(): Promise<BlogQueryResponse> {
    const startOfWeek = moment().startOf('week').format()
    const endOfWeek = moment().endOf('week').format()

    try {
      return await this.client.get({
        predicates: [
          prismic.predicate.at('document.type', 'post'),
          prismic.predicate.dateBetween('document.first_publication_date', startOfWeek , endOfWeek),
        ],
        pageSize: this.pageSize,
      })
    } catch (error: any) {
      return error
    }
  }
}

import { google } from "googleapis";

export class SearchConsole {
  private readonly webmasters: any;

  private readonly auth: any;

  constructor(auth: any) {
    this.auth = auth;
    this.webmasters = google.webmasters("v3");
  }

  public async getSiteSearchAnalytics(): Promise<any> {
    const params = {
      auth: this.auth,
      siteUrl: 'https://www.maddevs.io/',
      resource: {
        'startDate': '2022-06-20',
        'endDate': '2022-07-20',
        'dimensions': ['query']
      }
    }

    let response;

    try {
      response = await this.webmasters.searchanalytics.query(params)
    } catch (error: any) {
      throw new Error(error)
    }

    return response.data;
  }
}

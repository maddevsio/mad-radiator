// @ts-ignore
import axios, { AxiosResponse } from 'axios'

import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'

import { IMoosendConfig, IResponseFromMoosend } from './interfaces'

export class MoosendCountEmailsService implements RadiatorService {
  private readonly config: IMoosendConfig

  constructor(config: IMoosendConfig) {
    this.config = config
  }

  public getName(): string {
    return this.constructor.name
  }

  async perform(
    results: BuildMessageDataSpec,
    _radiator: RadiatorSpec,
  ): Promise<BuildMessageDataSpec> {
    return Object.assign(results, {
      emailsCount: await executeWithRetry(
        `${this.getName()}.getEmailsFromMoosend()`,
        5,
        1500,
        () => this.getEmailsFromMoosend(),
        (error: any) => error,
      ),
    })
  }

  private async getEmailsFromMoosend(): Promise<number> {
    const emails: { total: number } = await this.sendRequestToMoosend()
    return emails.total
  }

  private async sendRequestToMoosend(): Promise<{ total: number }> {
    const response: AxiosResponse = await axios.get(
      `${this.config.hostName}v3/lists/${this.config.mailingList}/subscribers/Subscribed.json?apikey=${this.config.apiKey}`,
    )
    const moosendData: IResponseFromMoosend = response.data
    return { total: moosendData.Context.Paging.TotalResults }
  }
}

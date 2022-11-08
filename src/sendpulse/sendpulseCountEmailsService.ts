import { BuildMessageDataSpec } from '../messengers/interfaces'
import { RadiatorService, RadiatorSpec } from '../radiator-spec'
import { executeWithRetry } from '../utils/executeWithRetry'
import { ISendpulseConfig } from './interfaces'
// @ts-ignore
import sendpulse from 'sendpulse-api-request'

export class sendpulseCountEmailsService implements RadiatorService {
  private readonly config: ISendpulseConfig

  constructor(config: ISendpulseConfig) {
    this.config = config
    sendpulse.init(this.config.apiUserId, this.config.apiKey, this.config.tokenStorage, () => {})
  }

  private async getEmailsFromSendpulse(): Promise<number> {
    const emails = await this.sendRequestToSendpulse()
    return emails.total
  }

  private async sendRequestToSendpulse(): Promise<{total: number}> {
    return new Promise(resolve => {
      sendpulse.sendRequest(`addressbooks/${this.config.addressBookId}/emails/total`, "GET", {}, (data: {total: number}) => {
        resolve(data)
      });
    })
  }

  public getName(): string {
    return this.constructor.name
  }

  async perform(results: BuildMessageDataSpec, _radiator: RadiatorSpec): Promise<BuildMessageDataSpec> {
    return Object.assign(
      results,
      {
        emailsCount: await executeWithRetry(
          `${this.getName()}.getEmailsFromSendpulse()`, 5, 1500,
          () => this.getEmailsFromSendpulse(),
          (error: any) => error),
      },
    )
  }
}

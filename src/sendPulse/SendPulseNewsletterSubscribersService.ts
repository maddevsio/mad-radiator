// @ts-ignore
import axios, { AxiosResponse } from "axios";

import { BuildMessageDataSpec } from "../messengers/interfaces";
import { RadiatorService, RadiatorSpec } from "../radiator-spec";
import { executeWithRetry } from "../utils/executeWithRetry";

import { ISendPulseAddressBookInfo } from "./inrefaces/ISendPulseBookInfoResponse";
import { ISendPulseConfig } from "./inrefaces/ISendPulseConfig";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sendpulse = require('sendpulse-api')

export class SendPulseNewsletterSubscribersService implements RadiatorService {
  private readonly config: ISendPulseConfig

  public sendPulse: any

  constructor(config: ISendPulseConfig) {
    this.config = config
    this.sendPulse = sendpulse
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
        `${this.getName()}.getTotalSubscribersNumber()`,
        5,
        1500,
        () => this.getTotalSubscribersNumber(),
        (error: any) => error,
      ),
    })
  }

  private initSendPulse(): Promise<void> {
    return new Promise(resolve => {
      this.sendPulse.init(this.config.sendPulseApiUserId, this.config.sendPulseApiKey, this.config.sendPulseTokenStorage, () => resolve())
    })
  }

  async getSendPulseSubscribersData(): Promise<ISendPulseAddressBookInfo[]> {
    await this.initSendPulse()
    return new Promise<ISendPulseAddressBookInfo[]>(resolve => sendpulse.getBookInfo((data: ISendPulseAddressBookInfo[]) => {
      resolve(data)
    }, this.config.addressBookId))
  }

  async getTotalSubscribersNumber() {
    const [bookInfo] = await this.getSendPulseSubscribersData()

    return {
      totalCount: bookInfo?.all_email_qty,
      activeCount: bookInfo?.active_email_qty,
    }
  }
}

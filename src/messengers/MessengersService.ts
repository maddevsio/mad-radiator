import { MessagesError } from 'errors/types/MessagesError'
import { MessengersParams } from 'interfaces'
import { Logger } from 'logger'
import { Slack } from 'messengers/Slack'
import { BuildMessageDataSpec } from 'messengers/interfaces'

import { MessageService } from '../radiator-spec'

export class MessengersService implements MessageService {
  readonly config: MessengersParams

  readonly slack: Slack

  constructor(config: MessengersParams) {
    this.config = config
    this.slack = new Slack(config)
  }

  public async sendMessages(buildMessageData: BuildMessageDataSpec): Promise<void> {
    try {
      if (this.config.slackWebhookUrl) await this.slack.sendMessage(buildMessageData)
    } catch (error) {
      Logger.error('Error during send message to slack')
      throw new MessagesError(`Error during send message to slack: ${error}`)
    }
  }
}

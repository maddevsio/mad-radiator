import { MessagesError } from 'errors/types/MessagesError'
import { MessengersParams } from 'interfaces'
import { Logger } from 'logger'
import { Slack } from 'messengers/Slack'
import { Telegram } from 'messengers/Telegram'
import { BuildMessageData } from 'messengers/interfaces'

export class MessengersService {
  readonly config: MessengersParams

  readonly slack: Slack

  readonly telegram: Telegram

  constructor(config: MessengersParams) {
    this.config = config
    this.slack = new Slack(config)
    this.telegram = new Telegram(config)
  }

  public async sendMessages(buildMessageData: BuildMessageData): Promise<void> {
    try {
      if (this.config.slackWebhookUrl) await this.slack.sendMessage(buildMessageData)
    } catch (error) {
      Logger.error('Error during send message to slack')
      throw new MessagesError(`Error during send message to slack: ${error}`)
    }

    try {
      if (this.config.telegramToken) await this.telegram.sendMessage(buildMessageData)
    } catch (error) {
      Logger.error('Error during send message to telegram')
      throw new MessagesError(`Error during send message to telegram: ${error}`)
    }
  }
}

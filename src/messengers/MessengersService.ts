import { MessagesError } from 'errors/types/MessagesError'
import { RadiatorConfig } from 'interfaces'
import { Logger } from 'logger'
import { Slack } from 'messengers/Slack'
import { Telegram } from 'messengers/Telegram'
import { BuildMessageData } from 'messengers/interfaces'



export class MessengersService {
  private readonly config: RadiatorConfig

  private readonly slack: Slack

  private readonly telegram: Telegram

  constructor(config: RadiatorConfig) {
    this.config = config
    this.slack = new Slack(config)
    this.telegram = new Telegram(config)
  }

  public async sendMessages(buildMessageData: BuildMessageData): Promise<void> {
    try {
      if (this.config.slack) await this.slack.sendMessage(buildMessageData)
    } catch (error) {
      Logger.error('Error during send message to slack')
      throw new MessagesError(`Error during send message to slack: ${error.toJSON()}`)
    }

    try {
      if (this.config.telegram) await this.telegram.sendMessage(buildMessageData)
    } catch (error) {
      Logger.error('Error during send message to telegram')
      throw new MessagesError(`Error during send message to telegram: ${error.toJSON()}`)
    }
  }
}

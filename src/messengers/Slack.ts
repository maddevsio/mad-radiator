import { Integration } from 'interfaces'
import { MessageBuilderFactory } from 'messengers/MessageBuilderFactory'
import { Messenger } from 'messengers/Messenger'
import { BuildMessageData } from 'messengers/interfaces'

export class Slack extends Messenger {
  protected messageBuilder = MessageBuilderFactory.createMessageBuilder(
    Integration.slack,
    this.config,
  )

  async sendMessage(buildMessageData: BuildMessageData) {
    const message = this.messageBuilder.getMessage(buildMessageData)
    const requestData = this.getRequestData(message)
    await this.sendRequest(this.config.env.slackWebhookUrl, requestData)
  }

  private getRequestData(message: string | Array<Object>) {
    return {
      username: 'Mad Radiator',
      icon_emoji: ':radio:',
      blocks: message,
      channel: this.config.slackChannelId,
    }
  }
}

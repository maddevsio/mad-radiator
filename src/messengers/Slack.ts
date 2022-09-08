import { MessageBuilderFactory } from 'messengers/MessageBuilderFactory'
import { Messenger } from 'messengers/Messenger'
import { BuildMessageDataSpec } from 'messengers/interfaces'

export class Slack extends Messenger {
  protected messageBuilder = MessageBuilderFactory.createMessageBuilder(this.config)

  async sendMessage(buildMessageData: BuildMessageDataSpec) {
    const message = this.messageBuilder.getMessage(buildMessageData)
    const requestData = this.getRequestData(message)
    await this.sendRequest(this.config.slackWebhookUrl, requestData)
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

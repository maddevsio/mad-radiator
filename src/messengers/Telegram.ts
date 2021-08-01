import { Integration } from 'interfaces'
import { MessageBuilderFactory } from 'messengers/MessageBuilderFactory'
import { Messenger } from 'messengers/Messenger'
import { BuildMessageData } from 'messengers/interfaces'

enum TelegramMessageType {
  message = 'Message',
  photo = 'Photo',
}

export class Telegram extends Messenger {
  protected messageBuilder = MessageBuilderFactory.createMessageBuilder(
    Integration.telegram,
    this.config,
  )

  async sendMessage(buildMessageData: BuildMessageData) {
    const message = this.messageBuilder.getMessage(buildMessageData)
    const requestData = this.getRequestData(TelegramMessageType.message, message)
    const url = this.getApiUrl(TelegramMessageType.message)
    await this.sendRequest(url, requestData)
    if (buildMessageData.imageURL) await this.sendPhoto(buildMessageData.imageURL)
  }

  private getRequestData(type: TelegramMessageType, text: string | Array<Object>, photo?: string) {
    const baseData = {
      chat_id: this.config.telegramChannelId,
    }

    const photoData = {
      photo,
      caption: text,
    }

    const messageData = {
      text,
      parse_mode: 'Markdown',
    }

    if (type === TelegramMessageType.message)
      return {
        ...baseData,
        ...messageData,
      }

    return {
      ...baseData,
      ...photoData,
    }
  }

  private getApiUrl(type: TelegramMessageType): string {
    return `https://api.telegram.org/bot${this.config.env.telegramToken}/send${type}`
  }

  private async sendPhoto(imageURL: string) {
    const url = this.getApiUrl(TelegramMessageType.photo)
    const requestData = this.getRequestData(TelegramMessageType.photo, 'Activity graph', imageURL)
    await this.sendRequest(url, requestData)
  }
}

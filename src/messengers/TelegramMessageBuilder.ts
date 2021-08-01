import { BlocksFactory } from 'blocks'
import { EmojiFactory } from 'emoji'
import { Integration } from 'interfaces'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { BuildMessageData } from 'messengers/interfaces'

export class TelegramMessageBuilder extends MessageBuilder {
  blocksService = BlocksFactory.createBlocksService(Integration.telegram)

  emojiService = EmojiFactory.createEmojiService(Integration.telegram)

  getMessage(buildMessageData: BuildMessageData): string | Array<Object> {
    return this.buildMessage(buildMessageData).join('')
  }
}

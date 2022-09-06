import { BlocksFactory } from 'blocks'
import { EmojiFactory } from 'emoji'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { BuildMessageDataSpec } from 'messengers/interfaces'

export class SlackMessageBuilder extends MessageBuilder {
  protected blocksService = BlocksFactory.createBlocksService()

  protected emojiService = EmojiFactory.createEmojiService()

  getMessage(buildMessageData: BuildMessageDataSpec): string | Array<Object> {
    return this.buildMessage(buildMessageData)
  }
}

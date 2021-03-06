import { BlocksFactory } from 'blocks'
import { EmojiFactory } from 'emoji'
import { Integration } from 'interfaces'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { BuildMessageData } from 'messengers/interfaces'

export class SlackMessageBuilder extends MessageBuilder {
  protected blocksService = BlocksFactory.createBlocksService(Integration.slack)

  protected emojiService = EmojiFactory.createEmojiService(Integration.slack)

  getMessage(buildMessageData: BuildMessageData): string | Array<Object> {
    return this.buildMessage(buildMessageData)
  }
}

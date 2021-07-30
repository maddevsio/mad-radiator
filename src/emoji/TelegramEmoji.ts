import { Emoji } from 'emoji/Emoji'
import { EmojiType } from 'emoji/interfaces'
import { Integration } from 'interfaces'

export class TelegramEmoji extends Emoji {
  integration = Integration.telegram

  getEmoji(type: EmojiType): string {
    return this.findEmoji(type)
  }
}

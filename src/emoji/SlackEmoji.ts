import { Emoji } from 'emoji/Emoji'
import { EmojiType } from 'emoji/interfaces'
import { Integration } from 'interfaces'
import emoji from 'node-emoji'

export class SlackEmoji extends Emoji {
  integration = Integration.slack

  getEmoji(type: EmojiType): string {
    const foundEmoji = this.findEmoji(type)
    return emoji.unemojify(foundEmoji)
  }
}

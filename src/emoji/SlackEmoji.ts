import { Emoji } from 'emoji/Emoji'
import { EmojiType } from 'emoji/interfaces'
import emoji from 'node-emoji'

export class SlackEmoji extends Emoji {
  getEmoji(type: EmojiType): string {
    const foundEmoji = this.findEmoji(type)
    return emoji.unemojify(foundEmoji)
  }
}

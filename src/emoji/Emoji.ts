import { DeviceTitle } from 'analytics/interfaces'
import { EmojiType } from 'emoji/interfaces'
import { Rate } from 'interfaces'
import emoji from 'node-emoji'

export abstract class Emoji {
  protected readonly emojiByRate: Record<Rate, EmojiType> = {
    good: 'yum',
    bad: 'rage',
    neutral: 'neutral_face',
  }

  protected readonly emojiByDevice: Record<DeviceTitle, EmojiType> = {
    desktop: 'computer',
    mobile: 'iphone',
    tablet: 'pager',
  }

  public abstract getEmoji(type: EmojiType): string

  public getRateEmoji(rate: Rate = Rate.neutral): string {
    return this.getEmoji(this.emojiByRate[rate])
  }

  public getEmojiTypeForDevice(deviceTitle: DeviceTitle): EmojiType {
    return this.emojiByDevice[deviceTitle]
  }

  protected findEmoji(type: EmojiType) {
    let foundEmoji = emoji.get(type)
    // if emoji was not found
    if (foundEmoji === `:${type}:`) foundEmoji = emoji.get('x')
    return foundEmoji
  }
}

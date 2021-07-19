import { Integration, Rate } from 'enums'
import { Emoji } from 'interfaces'
import { DeviceTitle } from 'interfaces/analytics'
import emoji from 'node-emoji'

export class EmojiService {
  private type: Integration

  constructor(type: Integration) {
    this.type = type
  }

  private readonly emojiByRate: Record<Rate, Emoji> = {
    good: 'yum',
    bad: 'rage',
    neutral: 'neutral_face',
  }

  private readonly emojiByDevice: Record<DeviceTitle, Emoji> = {
    desktop: 'computer',
    mobile: 'iphone',
    tablet: 'pager',
  }

  public setType(type: Integration) {
    this.type = type
  }

  public getEmoji(name: Emoji): string {
    let foundEmoji = emoji.get(name)
    // if emoji was not found
    if (foundEmoji === `:${name}:`) foundEmoji = emoji.get('x')
    if (this.type === Integration.telegram) return foundEmoji
    return emoji.unemojify(foundEmoji)
  }

  public getRateEmoji(rate: Rate = Rate.neutral): string {
    return this.getEmoji(this.emojiByRate[rate])
  }

  public getEmojiNameForDevice(deviceTitle: DeviceTitle) {
    return this.emojiByDevice[deviceTitle]
  }
}

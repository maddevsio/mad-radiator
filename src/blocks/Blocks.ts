import { CoreItem, Country, Device, Goal } from 'analytics/interfaces'
import { ListItemParameters } from 'blocks/interfaces'
import { Emoji } from 'emoji/Emoji'
import { EmojiType } from 'emoji/interfaces'
import { LighthouseEntity } from 'lighthouse/interfaces'
import { SlackMessageBlock } from 'messengers/interfaces/slack'
import { toISO } from 'utils/countryISO/toISO'

export abstract class Blocks {
  protected abstract readonly emojiService: Emoji

  public abstract divider(): string | SlackMessageBlock

  public abstract header(text: string): string | SlackMessageBlock

  public abstract image(imageURL?: string): string | SlackMessageBlock

  public abstract section(text: string): string | SlackMessageBlock

  public abstract list(items: Array<string>): string

  public listItem(
    entity: CoreItem | Goal | Device,
    { title, emojiType, parensKey, valueType = '', parensType = '' }: ListItemParameters,
  ): string {
    const rateEmoji = this.emojiService.getRateEmoji(entity.rate)
    const emoji = this.emojiService.getEmoji(emojiType)

    return `${rateEmoji} ${emoji} ${title}: *${entity.value}${valueType}* (${entity[parensKey]}${parensType})`
  }

  public performanceListItem(entity: LighthouseEntity, emojiType: EmojiType): string {
    const rateEmoji = this.emojiService.getRateEmoji(entity.rate)
    const emoji = this.emojiService.getEmoji(emojiType)

    return `${rateEmoji} ${emoji} ${entity.title}: *${entity.value}%*`
  }

  public countryListItem({ title, percentage }: Country): string {
    const flag = this.getFlag(title)
    return `${flag} ${title}: *${percentage}%* от всех посетителей сайта`
  }

  private getFlag(title: string): string {
    const iso = toISO(title)
    if (!iso) return this.emojiService.getEmoji('flags')
    const emoji = `flag-${iso.toLowerCase()}` as EmojiType
    return this.emojiService.getEmoji(emoji)
  }
}

import { Blog, CoreItem, Country, Device, Goal } from 'analytics/interfaces'
import { ListItemParameters } from 'blocks/interfaces'
import { Emoji } from 'emoji/Emoji'
import { EmojiType } from 'emoji/interfaces'
import { Rate } from 'interfaces'
import { LighthouseUrlResult } from 'lighthouse/interfaces'
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
    { title, emojiType, parensKey = "difference", valueType = '', parensType = '' }: ListItemParameters,
  ): string {
    const rateEmoji = this.emojiService.getRateEmoji(entity.rate)
    const emoji = this.emojiService.getEmoji(emojiType)

    return `${rateEmoji} ${emoji} ${title}: *${entity.value}${valueType}* (${entity[parensKey]}${parensType})`
  }

  public totalListItem(entity: CoreItem, { title, total, emojiType }: ListItemParameters): string {
    const emoji = this.emojiService.getEmoji(emojiType)
    return `${emoji} ${title}: *${entity.value}* / Should be > *${total}*`
  }

  public performanceListItem(title: string, value: number, emojiType: EmojiType): string {
    const rateEmoji = this.emojiService.getRateEmoji(Blocks.getRateForPerformance(value))
    const emoji = this.emojiService.getEmoji(emojiType)

    return `${rateEmoji} ${emoji} ${title}: *${value}%*`
  }

  public countryListItem({ title, percentage }: Country): string {
    const flag = this.getFlag(title)
    return `${flag} ${title}: *${percentage}%* от всех посетителей сайта`
  }

  public pagespeedRatingListItem({ url, average }: LighthouseUrlResult): string {
    const rateEmoji = this.emojiService.getRateEmoji(Blocks.getRateForPerformance(average))
    return `${rateEmoji} ${url} - *${average}%*`
  }

  private getFlag(title: string): string {
    const iso = toISO(title)
    if (!iso) return this.emojiService.getEmoji('flags')
    const emoji = `flag-${iso.toLowerCase()}` as EmojiType
    return this.emojiService.getEmoji(emoji)
  }

  private static getRateForPerformance(value: number): Rate {
    if (value >= 90) return Rate.good
    if (value >= 50) return Rate.neutral
    return Rate.bad
  }

  private static getRateForBlogsViews(value: number): Rate {
    if (value >= 15) return Rate.good
    if (value >= 10) return Rate.neutral
    return Rate.bad
  }


  public blogListItem({ pagePath, pageViews }: Blog): string {
    const rateEmoji = this.emojiService.getRateEmoji(Blocks.getRateForBlogsViews(pageViews))
    return `${rateEmoji} ${pagePath} - *${pageViews}* посещений`
  }
}


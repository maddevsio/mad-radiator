import { Integration, SlackMessageBlockType } from 'enums'
import { Emoji } from 'interfaces'
import { CoreItem, Country, Device, Goal } from 'interfaces/analytics'
import { LighthouseEntity } from 'interfaces/lighthouse'
import { SlackMessageBlock } from 'interfaces/slack'
import { EmojiService } from 'services/Emoji.service'
import { toISO } from 'utils/countryISO/toISO'

export class BlocksService {
  private type: Integration

  private readonly emojiService: EmojiService

  constructor(type: Integration, emojiService?: EmojiService) {
    this.type = type
    this.emojiService = emojiService || new EmojiService(type)
  }

  public setType(type: Integration) {
    this.type = type
    this.emojiService.setType(type)
  }

  public countryListItem({ title, percentage }: Country): string {
    const flag = this.getFlag(title)
    return `${flag} ${title}: *${percentage}%* от всех посетителей сайта`
  }

  public list(items: Array<string>): string {
    const joinString = this.type === Integration.slack ? '\n\n' : '\n'
    return [...items].join(joinString)
  }

  public listItem(
    entity: CoreItem | Goal | Device,
    title: string,
    emoji: Emoji,
    parensKey: 'difference' | 'previous',
    valueType = '',
    parensType = '',
  ): string {
    return `${this.emojiService.getRateEmoji(entity.rate)} ${this.emojiService.getEmoji(
      emoji,
    )} ${title}: *${entity.value}${valueType}* (${entity[parensKey]}${parensType})`
  }

  public performanceListItem(entity: LighthouseEntity, emoji: Emoji): string {
    return `${this.emojiService.getRateEmoji(entity.rate)} ${this.emojiService.getEmoji(emoji)} ${
      entity.title
    }: *${entity.value}%*`
  }

  public section(text: string): string | SlackMessageBlock {
    if (this.type === Integration.telegram) return BlocksService.telegramSection(text)
    return BlocksService.slackSection(text)
  }

  public divider(): string | SlackMessageBlock {
    if (this.type === Integration.telegram) return BlocksService.telegramDivider()
    return BlocksService.slackDivider()
  }

  public header(text: string): string | SlackMessageBlock {
    if (this.type === Integration.telegram) return BlocksService.telegramHeader(text)
    return BlocksService.slackHeader(text)
  }

  private static telegramHeader(text: string): string {
    return `*${text}*\n`
  }

  private static slackHeader(text: string): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.header,
      text: {
        type: 'plain_text',
        emoji: true,
        text,
      },
    }
  }

  private static telegramDivider(): string {
    return '———\n'
  }

  private static slackDivider(): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.divider,
    }
  }

  private static telegramSection(text: string): string {
    return `${text}\n\n`
  }

  private static slackSection(text: string): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.section,
      text: {
        type: 'mrkdwn',
        text: `${text}\n\n`,
      },
    }
  }

  private getFlag(title: string): string {
    const iso = toISO(title)
    if (!iso) return this.emojiService.getEmoji('flags')
    const emoji = `flag-${iso.toLowerCase()}` as Emoji
    return this.emojiService.getEmoji(emoji)
  }
}

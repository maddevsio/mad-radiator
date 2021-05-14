import { Integration } from 'enums'
import { Emoji } from 'interfaces'
import { CoreItem, Device, Goal } from 'interfaces/analytics'
import { getEmoji } from 'utils/emoji/getEmoji'
import { getRateEmoji } from 'utils/emoji/getRateEmoji'

export const listItem = (
  entity: CoreItem | Goal | Device,
  title: string,
  emoji: Emoji,
  parensKey: 'difference' | 'previous',
  integration: Integration,
  valueType = '',
  parensType = '',
): string =>
  `${getRateEmoji(entity.rate, integration)} ${getEmoji(emoji, integration)} ${title}: *${
    entity.value
  }${valueType}* (${entity[parensKey]}${parensType})`

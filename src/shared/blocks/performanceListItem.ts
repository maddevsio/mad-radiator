import { Integration } from 'enums'
import { Emoji } from 'interfaces'
import { LighthouseEntity } from 'interfaces/lighthouse'
import { getEmoji } from 'utils/emoji/getEmoji'
import { getRateEmoji } from 'utils/emoji/getRateEmoji'

export const performanceListItem = (
  entity: LighthouseEntity,
  emoji: Emoji,
  integration: Integration,
): string =>
  `${getRateEmoji(entity.rate, integration)} ${getEmoji(emoji, integration)} ${entity.title}: *${
    entity.value
  }%*`

import { Integration, Rate } from 'enums'
import { Emoji } from 'interfaces'
import { getEmoji } from 'utils/emoji/getEmoji'

const emojiByRate: Record<Rate, Emoji> = {
  good: 'yum',
  bad: 'rage',
  neutral: 'neutral_face',
}

export function getRateEmoji(
  rate: Rate = Rate.neutral,
  type: Integration = Integration.slack,
): string {
  return getEmoji(emojiByRate[rate], type)
}

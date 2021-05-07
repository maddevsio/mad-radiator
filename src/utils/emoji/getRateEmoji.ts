import { Emoji, Integration, Rate } from 'enums'
import { getEmoji } from 'utils/emoji/getEmoji'

const emojiByRate: Record<Rate, Emoji> = {
  good: Emoji.partyingFace,
  bad: Emoji.uncensoredFace,
  neutral: Emoji.neutralFace,
}

export function getRateEmoji(
  rate: Rate = Rate.neutral,
  type: Integration = Integration.slack,
): string {
  return getEmoji(emojiByRate[rate], type)
}

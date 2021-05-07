import { Emoji, Integration } from 'enums'
import { Country } from 'interfaces/analytics'
import { toISO } from 'utils/countryISO/toISO'
import { getEmoji } from 'utils/emoji/getEmoji'

const getFlag = (title: string, integration: Integration): string => {
  const iso = toISO(title)
  if (!iso) return getEmoji(Emoji.defaultFlag, integration)

  const emoji = `${iso.toLowerCase()}Flag`

  if (getEmoji(Emoji[emoji as keyof typeof Emoji]) !== ':x:') {
    return getEmoji(Emoji[emoji as keyof typeof Emoji], integration)
  }
  return getEmoji(Emoji.defaultFlag, integration)
}

export const countryListItem = (
  { title, percentage }: Country,
  integration: Integration,
): string => {
  const flag = getFlag(title, integration)
  return `${flag} ${title}: *${percentage}%* от всех посетителей сайта`
}

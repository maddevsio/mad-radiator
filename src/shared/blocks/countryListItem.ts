import { Integration } from 'enums'
import { Emoji } from 'interfaces'
import { Country } from 'interfaces/analytics'
import { toISO } from 'utils/countryISO/toISO'
import { getEmoji } from 'utils/emoji/getEmoji'

const getFlag = (title: string, integration: Integration): string => {
  const iso = toISO(title)
  if (!iso) return getEmoji('flags', integration)

  const emoji = `flag-${iso.toLowerCase()}` as Emoji

  if (getEmoji(emoji) !== ':x:') {
    return getEmoji(emoji, integration)
  }
  return getEmoji('flags', integration)
}

export const countryListItem = (
  { title, percentage }: Country,
  integration: Integration,
): string => {
  const flag = getFlag(title, integration)
  return `${flag} ${title}: *${percentage}%* от всех посетителей сайта`
}

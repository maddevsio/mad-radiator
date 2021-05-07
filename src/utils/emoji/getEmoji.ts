import { Emoji, Integration } from 'enums'
import { emoji } from 'utils/emoji'

export function getEmoji(name: Emoji, type: Integration = Integration.slack): string {
  return emoji[name] ? emoji[name][type] : emoji[Emoji.notFound][type]
}

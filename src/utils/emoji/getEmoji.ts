import { Integration } from 'enums'
import { Emoji } from 'interfaces'
import emoji from 'node-emoji'

export function getEmoji(name: Emoji, type: Integration = Integration.slack): string {
  const foundEmoji = emoji.get(name)
  if (!foundEmoji) return emoji.get('x')
  if (type === Integration.telegram) return foundEmoji
  return emoji.unemojify(foundEmoji)
}

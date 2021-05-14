import { Integration } from 'enums'
import { Emoji } from 'interfaces'
import emoji from 'node-emoji'

export function getEmoji(name: Emoji, type: Integration = Integration.slack): string {
  let foundEmoji = emoji.get(name)
  // if emoji was not found
  if (foundEmoji === `:${name}:`) foundEmoji = emoji.get('x')
  if (type === Integration.telegram) return foundEmoji
  return emoji.unemojify(foundEmoji)
}

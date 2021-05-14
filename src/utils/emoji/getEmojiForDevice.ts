import { Emoji } from 'interfaces'
import { DeviceTitle } from 'interfaces/analytics'

export function getEmojiForDevice(deviceTitle: DeviceTitle): Emoji {
  if (deviceTitle === 'desktop') return 'computer' as Emoji
  if (deviceTitle === 'mobile') return 'iphone' as Emoji
  return 'pager' as Emoji
}

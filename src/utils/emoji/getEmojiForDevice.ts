import { Emoji } from 'enums'
import { DeviceTitle } from 'interfaces/analytics'

export function getEmojiForDevice(deviceTitle: DeviceTitle) {
  if (deviceTitle === 'desktop') return Emoji.computer
  if (deviceTitle === 'mobile') return Emoji.iphone
  return Emoji.pager
}

import { Integration } from 'enums'
import { getEmoji } from 'utils/emoji/getEmoji'

describe('getEmoji utility', () => {
  it('should correctly return emoji by type=slack', () => {
    const emoji = getEmoji('calendar', Integration.slack)
    expect(emoji).toBe(':calendar:')
  })

  it('should correctly return emoji without type(slack by default)', () => {
    const emoji = getEmoji('calendar')
    expect(emoji).toBe(':calendar:')
  })

  it('should correctly return emoji by type=telegram', () => {
    const emoji = getEmoji('door', Integration.telegram)
    expect(emoji).toBe('\ud83d\udeaa')
  })
})

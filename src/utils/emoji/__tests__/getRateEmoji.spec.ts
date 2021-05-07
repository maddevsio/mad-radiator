import { Integration, Rate } from 'enums'
import { getRateEmoji } from 'utils/emoji/getRateEmoji'

describe('getRateEmoji utility', () => {
  it('should correctly return rate emoji', () => {
    const emoji = getRateEmoji(Rate.bad, Integration.slack)
    expect(emoji).toBe(':face_with_symbols_on_mouth:')
  })

  it('should correctly return rate emoji for telegram', () => {
    const emoji = getRateEmoji(Rate.good, Integration.telegram)
    expect(emoji).toBe('\ud83e\udd73')
  })

  it('should correctly return rate emoji without params', () => {
    const emoji = getRateEmoji()
    expect(emoji).toBe(':neutral_face:')
  })
})

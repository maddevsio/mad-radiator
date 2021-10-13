import { SlackEmoji } from 'emoji/SlackEmoji'
import { EmojiType } from 'emoji/interfaces'
import { Rate } from 'interfaces'

describe('SlackEmoji', () => {
  it('should correctly return an emoji', () => {
    const emojiService = new SlackEmoji()
    expect(emojiService.getEmoji('+1')).toBe(':thumbsup:')
  })

  it('should correctly return x emoji for custom', () => {
    const emojiService = new SlackEmoji()
    expect(emojiService.getEmoji('customemoji' as EmojiType)).toBe(':x:')
  })

  it('should correctly return an rate emoji', () => {
    const emojiService = new SlackEmoji()
    expect(emojiService.getRateEmoji(Rate.good)).toBe(':yum:')
  })

  it('should correctly return an rate emoji with no arguments', () => {
    const emojiService = new SlackEmoji()
    expect(emojiService.getRateEmoji()).toBe(':neutral_face:')
  })

  it('should correctly return an emoji type for device', () => {
    const emojiService = new SlackEmoji()
    expect(emojiService.getEmojiTypeForDevice('mobile')).toBe('iphone')
  })
})

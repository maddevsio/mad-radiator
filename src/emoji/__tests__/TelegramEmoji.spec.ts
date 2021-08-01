import { EmojiType } from 'emoji/interfaces'
import { TelegramEmoji } from 'emoji/TelegramEmoji'
import { Rate } from 'interfaces'

describe('TelegramEmoji', () => {
  it('should correctly return an emoji', () => {
    const emojiService = new TelegramEmoji()
    expect(emojiService.getEmoji('+1')).toBe('👍')
  })

  it('should correctly return x emoji for custom', () => {
    const emojiService = new TelegramEmoji()
    expect(emojiService.getEmoji('customemoji' as EmojiType)).toBe('❌')
  })

  it('should correctly return an rate emoji', () => {
    const emojiService = new TelegramEmoji()
    expect(emojiService.getRateEmoji(Rate.good)).toBe('😋')
  })

  it('should correctly return an rate emoji for neutral', () => {
    const emojiService = new TelegramEmoji()
    expect(emojiService.getRateEmoji()).toBe('😐')
  })

  it('should correctly return an emoji type for device', () => {
    const emojiService = new TelegramEmoji()
    expect(emojiService.getEmojiTypeForDevice('mobile')).toBe('iphone')
  })
})

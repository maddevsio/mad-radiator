import { EmojiFactory } from 'emoji/EmojiFactory'
import { SlackEmoji } from 'emoji/SlackEmoji'

describe('EmojiFactory', () => {
  it('should correctly return slack service', () => {
    const service = EmojiFactory.createEmojiService()

    expect(service).toBeInstanceOf(SlackEmoji)
  })
})

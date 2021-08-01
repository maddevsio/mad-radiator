import { EmojiFactory } from 'emoji/EmojiFactory'
import { SlackEmoji } from 'emoji/SlackEmoji'
import { TelegramEmoji } from 'emoji/TelegramEmoji'
import { Integration } from 'interfaces'

describe('EmojiFactory', () => {
  it('should correctly return slack service', () => {
    const service = EmojiFactory.createEmojiService(Integration.slack)

    expect(service).toBeInstanceOf(SlackEmoji)
  })

  it('should correctly return telegram service', () => {
    const service = EmojiFactory.createEmojiService(Integration.telegram)

    expect(service).toBeInstanceOf(TelegramEmoji)
  })
})

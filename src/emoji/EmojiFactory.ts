import { SlackEmoji } from 'emoji/SlackEmoji'
import { TelegramEmoji } from 'emoji/TelegramEmoji'
import { Integration } from 'interfaces'

export class EmojiFactory {
  public static createEmojiService(integration: Integration) {
    if (integration === Integration.telegram) return new TelegramEmoji()
    return new SlackEmoji()
  }
}

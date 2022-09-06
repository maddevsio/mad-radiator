import { SlackEmoji } from 'emoji/SlackEmoji'

export class EmojiFactory {
  public static createEmojiService() {
    return new SlackEmoji()
  }
}

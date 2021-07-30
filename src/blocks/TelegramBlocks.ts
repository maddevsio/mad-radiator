import { Blocks } from 'blocks/Blocks'
import { EmojiFactory } from 'emoji'
import { Integration } from 'interfaces'

export class TelegramBlocks extends Blocks {
  emojiService = EmojiFactory.createEmojiService(Integration.telegram)

  divider(): string {
    return '———\n'
  }

  header(text: string): string {
    return `*${text}*\n`
  }

  image(imageURL?: string): string {
    if (!imageURL) return this.divider()
    return `Chart: ${imageURL.split('_').join('//_')}\n\n`
  }

  section(text: string): string {
    return `${text}\n\n`
  }

  list(items: Array<string>): string {
    return [...items].join('\n')
  }
}

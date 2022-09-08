import { Blocks } from 'blocks/Blocks'
import { EmojiFactory } from 'emoji'
import { SlackMessageBlock, SlackMessageBlockType } from 'messengers/interfaces'

export class SlackBlocks extends Blocks {
  emojiService = EmojiFactory.createEmojiService()

  divider(): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.divider,
    }
  }

  header(text: string): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.header,
      text: {
        type: 'plain_text',
        emoji: true,
        text,
      },
    }
  }

  image(imageURL?: string): SlackMessageBlock {
    if (!imageURL) return this.divider()
    return {
      type: SlackMessageBlockType.image,
      image_url: imageURL,
      alt_text: 'Graph',
    }
  }

  section(text: string): SlackMessageBlock {
    return {
      type: SlackMessageBlockType.section,
      text: {
        type: 'mrkdwn',
        text: `${text}\n\n`,
      },
    }
  }

  list(items: Array<string>): string {
    return [...items].join('\n\n')
  }
}

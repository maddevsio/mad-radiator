import { SlackMessageBlockType } from 'enums'
import { SlackMessageBlock } from 'interfaces/slack'

export const header = (text: string): SlackMessageBlock => ({
  type: SlackMessageBlockType.header,
  text: {
    type: 'plain_text',
    emoji: true,
    text,
  },
})

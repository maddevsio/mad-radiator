import { SlackMessageBlockType } from 'enums'
import { SlackMessageBlock, SlackMessageBlockTextType } from 'interfaces/slack'

export const section = (
  text: string,
  type: SlackMessageBlockTextType = 'mrkdwn',
): SlackMessageBlock => ({
  type: SlackMessageBlockType.section,
  text: {
    type,
    text: `${text}\n\n`,
  },
})

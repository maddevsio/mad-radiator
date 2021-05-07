import { SlackMessageBlockType } from 'enums'

export type SlackMessageBlockTextType = 'plain_text' | 'mrkdwn'

export type SlackMessageBlock = {
  type: SlackMessageBlockType
  text?: {
    type?: SlackMessageBlockTextType
    emoji?: boolean
    text?: string
  }
}

export type SlackMessage = {
  text?: string
  blocks?: Array<SlackMessageBlock>
}

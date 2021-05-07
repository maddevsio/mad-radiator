import { SlackMessageBlockType } from 'enums'

export type SlackMessageBlockTextType = 'plain_text' | 'mrkdwn'

export interface SlackMessageBlock {
  type: SlackMessageBlockType
  text?: {
    type?: SlackMessageBlockTextType
    emoji?: boolean
    text?: string
  }
}

export interface SlackMessage {
  text?: string
  blocks?: Array<SlackMessageBlock>
}

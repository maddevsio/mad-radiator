export enum SlackMessageBlockType {
  header = 'header',
  divider = 'divider',
  section = 'section',
  image = 'image',
}

export type SlackMessageBlockTextType = 'plain_text' | 'mrkdwn'

export interface SlackMessageBlock {
  type: SlackMessageBlockType
  image_url?: string
  alt_text?: string
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

import { SlackMessageBlockType } from 'enums'
import { SlackMessageBlock } from 'interfaces/slack'

export const divider = (): SlackMessageBlock => ({
  type: SlackMessageBlockType.divider,
})

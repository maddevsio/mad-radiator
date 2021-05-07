import axios from 'axios'
import { Emoji } from 'enums'
import { RadiatorConfig } from 'interfaces'
import { SlackMessage } from 'interfaces/slack'
import { getEmoji } from 'utils/emoji/getEmoji'

const slackConfig = {
  username: 'Mad Radiator',
  icon_emoji: getEmoji(Emoji.radio),
}

export async function sendMessage(message: SlackMessage, config: RadiatorConfig): Promise<void> {
  const data = {
    ...slackConfig,
    ...message,
    channel: config.slackChannelId,
  }

  await axios.post(config.env.slackWebhookUrl, data)
}

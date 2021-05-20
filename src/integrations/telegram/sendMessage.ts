import axios from 'axios'
import { RadiatorConfig } from 'interfaces'

export async function sendMessage(message: string, config: RadiatorConfig): Promise<void> {
  const url = `https://api.telegram.org/bot${config.env.telegramToken}/sendMessage`
  const data = {
    chat_id: config.telegramChannelId,
    text: message,
    parse_mode: 'Markdown',
  }

  await axios.post(url, data)
}

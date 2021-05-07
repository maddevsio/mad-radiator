import { buildMessage } from 'integrations/telegram/buildMessage'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import TelegramBot from 'node-telegram-bot-api'

export default async function main(
  analytics: AnalyticsData,
  range: ParsedRange,
  lighthouse: LighthouseData,
  config: RadiatorConfig,
): Promise<void> {
  const bot = new TelegramBot(config.env.telegramToken, { polling: true })
  const message = buildMessage(analytics, range, lighthouse, config)
  await bot.sendMessage(config.telegramChannelId, message, {
    parse_mode: 'Markdown',
  })
}

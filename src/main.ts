import getAnalyticsData from 'integrations/analytics'
import getLighthouseData from 'integrations/lighthouse'
import sendMessageToSlack from 'integrations/slack'
import sendMessageToTelegram from 'integrations/telegram'
import { RadiatorConfig } from 'interfaces'
import { info, success } from 'logger'
import { parseRange } from 'utils/parseRange'

export default async function radiator(config: RadiatorConfig): Promise<void> {
  info('Starting...')
  const range = parseRange(config.range)

  info('Getting data from analytics...')
  const analytics = await getAnalyticsData(range, config)

  info('Getting data from lighthouse...')
  const lighthouse = await getLighthouseData(config)

  if (config.slack) {
    info('Sending message to slack...')
    await sendMessageToSlack(analytics, range, lighthouse, config)
    success('Message was successfully sent!')
  }

  if (config.telegram) {
    info('Sending message to telegram...')
    await sendMessageToTelegram(analytics, range, lighthouse, config)
    success('Message was successfully sent!')
  }

  process.exit()
}

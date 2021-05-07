import { buildMessage } from 'integrations/slack/buildMessage'
import { sendMessage } from 'integrations/slack/sendMessage'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'

export default async function main(
  analytics: AnalyticsData,
  range: ParsedRange,
  lighthouse: LighthouseData,
  config: RadiatorConfig,
): Promise<void> {
  const message = buildMessage(analytics, range, lighthouse, config)
  await sendMessage(message, config)
}

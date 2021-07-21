import { Integration } from 'enums'
import { ParsedRange } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { Messenger } from 'messengers/Messenger'

export class Slack extends Messenger {
  public async sendMessage(
    analytics: AnalyticsData,
    range: ParsedRange,
    lighthouse: LighthouseData,
    imageURL?: string,
  ): Promise<void> {
    const blocks = this.buildMessage(analytics, range, lighthouse, Integration.slack, imageURL)
    const data = {
      username: 'Mad Radiator',
      icon_emoji: ':radio:',
      blocks,
      channel: this.config.slackChannelId,
    }
    await this.send(this.config.env.slackWebhookUrl, data)
  }
}

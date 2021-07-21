import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { Slack } from 'messengers/Slack'
import { Telegram } from 'messengers/Telegram'
import { LoggerService } from 'services/Logger.service'

export class MessengersService {
  private readonly config: RadiatorConfig

  private readonly slack?: Slack

  private readonly telegram?: Telegram

  constructor(config: RadiatorConfig) {
    this.config = config
    if (this.config.slack) this.slack = new Slack(config)
    if (this.config.telegram) this.telegram = new Telegram(config)
  }

  public async send(
    analytics: AnalyticsData,
    lighthouse: LighthouseData,
    range: ParsedRange,
    imageURL?: string,
  ): Promise<void> {
    try {
      if (this.slack) await this.slack.sendMessage(analytics, range, lighthouse, imageURL)
    } catch (error) {
      LoggerService.error('Error during send message to slack')
      LoggerService.error(error)
    }

    try {
      if (this.telegram) await this.telegram.sendMessage(analytics, range, lighthouse, imageURL)
    } catch (error) {
      LoggerService.error('Error during send message to telegram')
      LoggerService.error(error)
    }
  }
}

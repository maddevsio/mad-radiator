import { Integration } from 'enums'
import { ParsedRange } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { Messenger } from 'messengers/Messenger'

export class Telegram extends Messenger {
  public async sendMessage(
    analytics: AnalyticsData,
    range: ParsedRange,
    lighthouse: LighthouseData,
    imageURL?: string,
  ): Promise<void> {
    const message = this.buildMessage(analytics, range, lighthouse, Integration.telegram, imageURL)

    const url = `https://api.telegram.org/bot${this.config.env.telegramToken}/sendMessage`
    const data = {
      chat_id: this.config.telegramChannelId,
      text: message.join(''),
      parse_mode: 'Markdown',
    }
    await this.send(url, data)
    if (imageURL) await this.sendPhoto(imageURL)
  }

  private async sendPhoto(imageURL: string) {
    const url = `https://api.telegram.org/bot${this.config.env.telegramToken}/sendPhoto`
    const data = {
      chat_id: this.config.telegramChannelId,
      photo: imageURL,
      caption: 'График активности пользователей за последние 14 дней',
    }
    await this.send(url, data)
  }
}

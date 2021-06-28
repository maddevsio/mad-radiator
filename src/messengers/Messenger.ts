import axios from 'axios'
import { BlocksService } from 'blocks/Blocks.service'
import { EmojiService } from 'emoji/Emoji.service'
import { Integration } from 'enums'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { capitalize } from 'utils/capitalize'
import { getEmojiForDevice } from 'utils/emoji/getEmojiForDevice'

export class Messenger {
  protected readonly config: RadiatorConfig

  private readonly emojiService: EmojiService

  private readonly blocksService: BlocksService

  constructor(config: RadiatorConfig) {
    this.config = config
    this.emojiService = new EmojiService(Integration.slack)
    this.blocksService = new BlocksService(Integration.slack, this.emojiService)
  }

  protected async send(url: string, data: Object): Promise<void> {
    await axios.post(url, data)
  }

  protected buildMessage(
    analytics: AnalyticsData,
    range: ParsedRange,
    lighthouse: LighthouseData,
    integration: Integration,
  ): Array<string | object> {
    const { core, devices, goals, countries } = analytics

    this.blocksService.setType(integration)
    this.emojiService.setType(integration)

    return [
      this.blocksService.header(
        `${this.emojiService.getEmoji('calendar')} Отчет радиатора по ключевым метрикам за ${
          range.text
        }`,
      ),
      this.blocksService.divider(),
      this.blocksService.section(
        `За отчетный период сайт ${this.config.websiteUrl} посетило *${core.users.value} пользователей*. Всего *${core.sessions.value} сессий*, средняя длительность 1 сессии составляет *${core.duration.value}*. *${core.bounceRate.value}%* пользователей закрыли сайт никак с ним не провзаимодействовав.`,
      ),
      this.blocksService.section(
        this.blocksService.list([
          this.blocksService.listItem(core.users, 'Users', 'man', 'difference', '', '%'),
          this.blocksService.listItem(core.sessions, 'Sessions', 'door', 'difference', '', '%'),
          this.blocksService.listItem(
            core.bounceRate,
            'Bounce Rate',
            'moyai',
            'difference',
            '%',
            '%',
          ),
          this.blocksService.listItem(
            core.duration,
            'Session Duration',
            'clock1',
            'difference',
            '',
            '%',
          ),
        ]),
      ),
      this.blocksService.divider(),
      this.blocksService.section('Сайт просматривают на разных устройствах. Соотношение:'),
      this.blocksService.section(
        this.blocksService.list(
          devices.map(device =>
            this.blocksService.listItem(
              device,
              capitalize(device.title),
              getEmojiForDevice(device.title),
              'previous',
              '%',
              '%',
            ),
          ),
        ),
      ),
      this.blocksService.divider(),
      this.blocksService.section(
        'Топ-3 страны, в которых находятся пользователи, посетившие сайт:',
      ),
      this.blocksService.section(
        this.blocksService.list(
          countries.map(country => this.blocksService.countryListItem(country)),
        ),
      ),
      this.blocksService.divider(),
      this.blocksService.section('Клики и конверсии произведенные пользователями:'),
      this.blocksService.section(
        this.blocksService.list(
          goals.map(goal => this.blocksService.listItem(goal, goal.name, goal.emoji, 'previous')),
        ),
      ),
      this.blocksService.divider(),
      this.blocksService.section('Производительность сайта от Google PageSpeed:'),
      this.blocksService.section(
        this.blocksService.list([
          this.blocksService.performanceListItem(
            lighthouse.performance,
            'chart_with_upwards_trend',
          ),
          this.blocksService.performanceListItem(lighthouse.accessibility, 'wheelchair'),
          this.blocksService.performanceListItem(lighthouse['best-practices'], 'the_horns'),
          this.blocksService.performanceListItem(lighthouse.seo, 'sports_medal'),
          this.blocksService.performanceListItem(lighthouse.pwa, 'iphone'),
        ]),
      ),
      this.blocksService.divider(),
    ]
  }
}

import { CoreItems, Country, Device, Goals } from 'analytics/interfaces'
import { Blocks } from 'blocks/Blocks'
import { Emoji } from 'emoji/Emoji'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { LighthouseMetrics, LighthouseUrlResult } from 'lighthouse/interfaces'
import { BuildMessageData, SlackMessageBlock } from 'messengers/interfaces'
import { capitalize } from 'utils/capitalize'

export abstract class MessageBuilder {
  protected abstract readonly blocksService: Blocks

  protected abstract readonly emojiService: Emoji

  protected readonly config: RadiatorConfig

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  public abstract getMessage(buildMessageData: BuildMessageData): string | Array<Object>

  protected buildMessage({
    analytics,
    range,
    lighthouse,
    imageURL,
  }: BuildMessageData): Array<string | SlackMessageBlock> {
    const { core, devices, goals, countries } = analytics

    const message = []

    // header
    message.push(this.blocksService.header(this.headerMessage(range)))
    message.push(this.blocksService.divider())

    // core section
    message.push(this.blocksService.section(this.coreMessage(core)))
    message.push(this.blocksService.section(this.coreList(core)))
    message.push(this.blocksService.divider())

    // devices
    message.push(this.blocksService.section(MessageBuilder.devicesMessage()))
    message.push(this.blocksService.section(this.devicesList(devices)))
    message.push(this.blocksService.divider())

    // countries
    message.push(this.blocksService.section(MessageBuilder.countriesMessage()))
    message.push(this.blocksService.section(this.countriesList(countries)))
    message.push(this.blocksService.divider())

    // conversions
    message.push(this.blocksService.section(MessageBuilder.conversionMessage()))
    message.push(this.blocksService.section(this.conversionList(goals)))
    message.push(this.blocksService.divider())

    // pagespeed average
    message.push(
      this.blocksService.section(MessageBuilder.pagespeedAverageMessage(lighthouse.urlCount)),
    )
    message.push(this.blocksService.section(this.pagespeedList(lighthouse.average)))
    message.push(this.blocksService.divider())

    // pagespeed top
    if (lighthouse.top.length) {
      message.push(this.blocksService.section(MessageBuilder.pagespeedBestMessage()))
      message.push(this.blocksService.section(this.pagespeedRating(lighthouse.top)))
      message.push(this.blocksService.divider())
    }

    // pagespeed worst
    if (lighthouse.worst.length) {
      message.push(this.blocksService.section(MessageBuilder.pagespeedWorstMessage()))
      message.push(this.blocksService.section(this.pagespeedRating(lighthouse.worst)))
      message.push(this.blocksService.divider())
    }

    // image
    message.push(this.blocksService.image(imageURL))
    message.push(this.blocksService.divider())

    return message
  }

  private headerMessage(range: ParsedRange): string {
    return `${this.emojiService.getEmoji('calendar')} Отчет радиатора по ключевым метрикам за ${
      range.text
    }`
  }

  private coreMessage({ users, duration, sessions, bounceRate }: CoreItems): string {
    // ${integration === Integration.slack ? '<!here>' : ''}
    return `За отчетный период сайт ${this.config.websiteUrl} посетило *${users.value} пользователей*. Всего *${sessions.value} сессий*, средняя длительность 1 сессии составляет *${duration.value}*. *${bounceRate.value}%* пользователей закрыли сайт никак с ним не провзаимодействовав.`
  }

  private coreList({ users, duration, sessions, bounceRate }: CoreItems) {
    return this.blocksService.list([
      this.blocksService.listItem(users, {
        title: 'Users',
        emojiType: 'man',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
      this.blocksService.listItem(sessions, {
        title: 'Sessions',
        emojiType: 'door',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
      this.blocksService.listItem(bounceRate, {
        title: 'Bounce Rate',
        emojiType: 'moyai',
        parensKey: 'difference',
        valueType: '%',
        parensType: '%',
      }),
      this.blocksService.listItem(duration, {
        title: 'Session Duration',
        emojiType: 'clock1',
        parensKey: 'difference',
        valueType: '',
        parensType: '%',
      }),
    ])
  }

  private static devicesMessage() {
    return 'Сайт просматривают на разных устройствах. Соотношение:'
  }

  private devicesList(devices: Array<Device>) {
    return this.blocksService.list(
      devices.map(device =>
        this.blocksService.listItem(device, {
          title: capitalize(device.title),
          emojiType: this.emojiService.getEmojiTypeForDevice(device.title),
          parensKey: 'previous',
          valueType: '%',
          parensType: '%',
        }),
      ),
    )
  }

  private static countriesMessage() {
    return 'Топ-3 страны, в которых находятся пользователи, посетившие сайт:'
  }

  private countriesList(countries: Array<Country>) {
    return this.blocksService.list(
      countries.map(country => this.blocksService.countryListItem(country)),
    )
  }

  private static conversionMessage() {
    return 'Клики и конверсии произведенные пользователями:'
  }

  private conversionList(goals: Goals) {
    return this.blocksService.list(
      goals.map(goal =>
        this.blocksService.listItem(goal, {
          title: goal.name,
          emojiType: goal.emoji,
          parensKey: 'previous',
        }),
      ),
    )
  }

  private static pagespeedAverageMessage(count: number) {
    return `Средняя производительность сайта от Google PageSpeed(Проанализировано ${count} страниц):`
  }

  private pagespeedList(lighthouse: LighthouseMetrics) {
    return this.blocksService.list([
      this.blocksService.performanceListItem(
        'Performance',
        lighthouse.performance,
        'chart_with_upwards_trend',
      ),
      this.blocksService.performanceListItem(
        'Accessibility',
        lighthouse.accessibility,
        'wheelchair',
      ),
      this.blocksService.performanceListItem(
        'Best Practices',
        lighthouse.best_practices,
        'the_horns',
      ),
      this.blocksService.performanceListItem('SEO', lighthouse.seo, 'sports_medal'),
      this.blocksService.performanceListItem('PWA', lighthouse.pwa, 'iphone'),
    ])
  }

  private static pagespeedBestMessage() {
    return 'Лучшие страницы:'
  }

  private static pagespeedWorstMessage() {
    return 'Худшие страницы:'
  }

  private pagespeedRating(urls: Array<LighthouseUrlResult>) {
    return this.blocksService.list(
      urls.map(urlResult => this.blocksService.pagespeedRatingListItem(urlResult)),
    )
  }
}
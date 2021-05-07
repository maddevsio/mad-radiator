import { Emoji, Integration } from 'enums'
import { divider } from 'integrations/telegram/blocks/divider'
import { header } from 'integrations/telegram/blocks/header'
import { section } from 'integrations/telegram/blocks/section'
import { ParsedRange, RadiatorConfig } from 'interfaces'
import { AnalyticsData } from 'interfaces/analytics'
import { LighthouseData } from 'interfaces/lighthouse'
import { countryListItem } from 'shared/blocks/countryListItem'
import { list } from 'shared/blocks/list'
import { listItem } from 'shared/blocks/listItem'
import { performanceListItem } from 'shared/blocks/performanceListItem'
import { capitalize } from 'utils/capitalize'
import { getEmoji } from 'utils/emoji/getEmoji'
import { getEmojiForDevice } from 'utils/emoji/getEmojiForDevice'

export function buildMessage(
  analytics: AnalyticsData,
  range: ParsedRange,
  lighthouse: LighthouseData,
  config: RadiatorConfig,
): string {
  const { core, devices, goals, countries } = analytics

  return [
    header(
      `${getEmoji(Emoji.calendar, Integration.telegram)} Отчет радиатора по ключевым метрикам за ${
        range.text
      }`,
    ),
    divider(),
    section(
      `За отчетный период сайт ${config.websiteUrl} посетило *${core.users.value} пользователей*. Всего *${core.sessions.value} сессий*, средняя длительность 1 сессии составляет *${core.duration.value}*. *${core.bounceRate.value}%* пользователей закрыли сайт никак с ним не провзаимодействовав.`,
    ),
    section(
      list(
        [
          listItem(
            core.users,
            'Users',
            Emoji.technologist,
            'difference',
            Integration.telegram,
            '',
            '%',
          ),
          listItem(
            core.sessions,
            'Sessions',
            Emoji.door,
            'difference',
            Integration.telegram,
            '',
            '%',
          ),
          listItem(
            core.bounceRate,
            'Bounce Rate',
            Emoji.moyai,
            'difference',
            Integration.telegram,
            '%',
            '%',
          ),
          listItem(
            core.duration,
            'Session Duration',
            Emoji.clock,
            'difference',
            Integration.telegram,
            '',
            '%',
          ),
        ],
        Integration.telegram,
      ),
    ),
    divider(),
    section('Сайт просматривают на разных устройствах. Соотношение:'),
    section(
      list(
        devices.map(device =>
          listItem(
            device,
            capitalize(device.title),
            getEmojiForDevice(device.title),
            'previous',
            Integration.telegram,
            '%',
            '%',
          ),
        ),
        Integration.telegram,
      ),
    ),
    divider(),
    section('Топ-3 страны, в которых находятся пользователи, посетившие сайт:'),
    section(
      list(
        countries.map(country => countryListItem(country, Integration.telegram)),
        Integration.telegram,
      ),
    ),
    divider(),
    section('Клики и конверсии произведенные пользователями:'),
    section(
      list(
        [
          listItem(goals.leads, 'Leads', Emoji.zap, 'previous', Integration.telegram),
          listItem(
            goals.contacts,
            'Contacts',
            Emoji.telephoneReceiver,
            'previous',
            Integration.telegram,
          ),
          listItem(goals.career, 'Careers', Emoji.briefcase, 'previous', Integration.telegram),
        ],
        Integration.telegram,
      ),
    ),
    divider(),
    section('Производительность сайта от Google PageSpeed:'),
    section(
      list(
        [
          performanceListItem(lighthouse.performance, Emoji.chart, Integration.telegram),
          performanceListItem(lighthouse.accessibility, Emoji.wheelchair, Integration.telegram),
          performanceListItem(lighthouse['best-practices'], Emoji.horns, Integration.telegram),
          performanceListItem(lighthouse.seo, Emoji.medal, Integration.telegram),
          performanceListItem(lighthouse.pwa, Emoji.iphone, Integration.telegram),
        ],
        Integration.telegram,
      ),
    ),
    divider(),
  ].join('')
}

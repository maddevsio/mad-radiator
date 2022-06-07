import { MockedDate } from '__tests__/fixtures/MockedDate'
import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { SlackMessageBuilder } from 'messengers/SlackMessageBuilder'

describe('SlackMessageBuilder', () => {
  beforeEach(() => {
    // @ts-ignore
    global.Date = MockedDate
  })

  it('should correctly return an instance', () => {
    const builder = new SlackMessageBuilder(defaultConfig)

    expect(builder.getMessage).toBeTruthy()
  })

  it('should getMessage correctly return message', () => {
    const builder = new SlackMessageBuilder(defaultConfig)

    const message = builder.getMessage({
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
      redditCountPosts: 0,
    })

    expect(message).toEqual([
      {
        text: {
          emoji: true,
          text: ':calendar: Отчет радиатора по ключевым метрикам за 31/7/2021',
          type: 'plain_text',
        },
        type: 'header',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text:
            'За отчетный период сайт  посетило *100 пользователей*. Всего *100 сессий*, средняя длительность 1 сессии составляет *100*. *100%* пользователей закрыли сайт никак с ним не провзаимодействовав.\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text:
            ':yum: :man: Users: *100* (100%%)\n\n:yum: :door: Sessions: *100* (100%%)\n\n:yum: :moyai: Bounce Rate: *100%* (100%%)\n\n:yum: :clock1: Session Duration: *100* (100%%)\n\n:x: Пользователей за последние 7 дней: *2888* / Should be > *3000*\n\n:x: Пользователей за последние 28 дней: *10001* / Should be > *11000*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text: '*Топ-3 страны, в которых находятся пользователи, посетившие сайт:*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: ':flag-ru: Russia: *100%* от всех посетителей сайта\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: ':x: Should be -> United States, United Kingdom, Germany, France, Indonesia, Vietnam\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text: '*Заполнения формы contact me:*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: ':x: Заполнения за последние 30 дней: 4 / Should be > 5\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text: '*Количество новых постов на Reddit:*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: ':x: Новых статей за Июнь: 0 / Should be -> 2\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text:
            'Средняя производительность сайта от Google PageSpeed(Проанализировано 100 страниц):\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text:
            ':yum: :chart_with_upwards_trend: Performance: *100%*\n\n:yum: :wheelchair: Accessibility: *100%*\n\n:yum: :sign_of_the_horns: Best Practices: *100%*\n\n:yum: :sports_medal: SEO: *100%*\n\n:yum: :iphone: PWA: *100%*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        text: {
          text: '*Топ-3 популярных статей в блоге:*\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        text: {
          text: ':yum: https://maddevs.io/insights/blog/how-to-start-developing-for-raspberry-pi-with-qt/ - *19* посещений\n\n',
          type: 'mrkdwn',
        },
        type: 'section',
      },
      {
        type: 'divider',
      },
      {
        alt_text: 'Graph',
        image_url: '123',
        type: 'image',
      },
      {
        type: 'divider',
      },
    ])
  })
})

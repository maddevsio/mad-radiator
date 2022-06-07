import { MockedDate } from '__tests__/fixtures/MockedDate'
import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { LighthouseUrlResult } from 'lighthouse/interfaces'
import { TelegramMessageBuilder } from 'messengers/TelegramMessageBuilder'

describe('TelegramMessageBuilder', () => {
  beforeEach(() => {
    // @ts-ignore
    global.Date = MockedDate
  })

  it('should correctly return an instance', () => {
    const builder = new TelegramMessageBuilder(defaultConfig)

    expect(builder.getMessage).toBeTruthy()
  })

  it('should getMessage correctly return message', () => {
    const builder = new TelegramMessageBuilder(defaultConfig)

    const urlResult: LighthouseUrlResult = {
      url: 'maddevs.io',
      metrics: {
        accessibility: 90,
        performance: 90,
        best_practices: 90,
        pwa: 90,
        seo: 90,
      },
      average: 90,
    }

    const lighthouse = {
      ...lighthouseData,
      top: [urlResult],
      worst: [urlResult],
    }

    const message = builder.getMessage({
      analytics: analyticsData,
      lighthouse,
      range: parsedRange,
      imageURL: '123',
      redditCountPosts: 0,
    })

    expect(message).toEqual(`*📆 Отчет радиатора по ключевым метрикам за 31/7/2021*
———
За отчетный период сайт  посетило *100 пользователей*. Всего *100 сессий*, средняя длительность 1 сессии составляет *100*. *100%* пользователей закрыли сайт никак с ним не провзаимодействовав.

😋 👨 Users: *100* (100%%)
😋 🚪 Sessions: *100* (100%%)
😋 🗿 Bounce Rate: *100%* (100%%)
😋 🕐 Session Duration: *100* (100%%)
❌ Пользователей за последние 7 дней: *2888* / Should be > *3000*
❌ Пользователей за последние 28 дней: *10001* / Should be > *11000*

———
*Топ-3 страны, в которых находятся пользователи, посетившие сайт:*

🇷🇺 Russia: *100%* от всех посетителей сайта

:x: Should be -> United States, United Kingdom, Germany, France, Indonesia, Vietnam

———
*Заполнения формы contact me:*

:x: Заполнения за последние 30 дней: 4 / Should be > 5

———
*Количество новых постов на Reddit:*

:x: Новых статей за Июнь: 0 / Should be -> 2

———
Средняя производительность сайта от Google PageSpeed(Проанализировано 100 страниц):

😋 📈 Performance: *100%*
😋 ♿ Accessibility: *100%*
😋 🤘 Best Practices: *100%*
😋 🏅 SEO: *100%*
😋 📱 PWA: *100%*

———
Лучшие страницы:

😋 maddevs.io - *90%*

———
Худшие страницы:

😋 maddevs.io - *90%*

———
*Топ-3 популярных статей в блоге:*

😋 https://maddevs.io/insights/blog/how-to-start-developing-for-raspberry-pi-with-qt/ - *19* посещений

———
[Activity graph](123)

———
`)
  })
})

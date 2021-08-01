import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { analyticsData } from '__tests__/fixtures/analyticsData'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { TelegramMessageBuilder } from 'messengers/TelegramMessageBuilder'

describe('TelegramMessageBuilder', () => {
  it('should correctly return an instance', () => {
    const builder = new TelegramMessageBuilder(defaultConfig)

    expect(builder.getMessage).toBeTruthy()
  })

  it('should getMessage correctly return message', () => {
    const builder = new TelegramMessageBuilder(defaultConfig)

    const message = builder.getMessage({
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    })

    expect(message).toEqual(`*📆 Отчет радиатора по ключевым метрикам за 31/7/2021*
———
За отчетный период сайт  посетило *100 пользователей*. Всего *100 сессий*, средняя длительность 1 сессии составляет *100*. *100%* пользователей закрыли сайт никак с ним не провзаимодействовав.

😋 👨 Users: *100* (100%%)
😋 🚪 Sessions: *100* (100%%)
😋 🗿 Bounce Rate: *100%* (100%%)
😋 🕐 Session Duration: *100* (100%%)

———
Сайт просматривают на разных устройствах. Соотношение:

😐 📱 Mobile: *100%* (50%)

———
Топ-3 страны, в которых находятся пользователи, посетившие сайт:

🇷🇺 Russia: *100%* от всех посетителей сайта

———
Клики и конверсии произведенные пользователями:

😋 👍 Name: *100* (95)

———
Производительность сайта от Google PageSpeed:

😋 📈 Access: *100%*
😋 ♿ Access: *100%*
😋 🤘 Access: *100%*
😋 🏅 Access: *100%*
😋 📱 Access: *100%*

———
Chart: 123

———
`)
  })
})

import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import axios from 'axios'
import { Telegram } from 'messengers/Telegram'

jest.spyOn(axios, 'post').mockImplementation(
  () => new Promise<void>(res => res()),
)

describe('Telegram messenger', () => {
  it('should correctly created an instance', () => {
    const telegram = new Telegram(defaultConfig)

    expect(telegram.sendMessage).toBeTruthy()
  })

  it('should sendMessage correctly sendMessage', async () => {
    const buildMessageData = {
      analytics: analyticsData,
      lighthouse: lighthouseData,
      range: parsedRange,
      imageURL: '123',
    }
    const slack = new Telegram(defaultConfig)
    const getApiUrlMock = jest.spyOn(Telegram.prototype as any, 'getApiUrl');
    getApiUrlMock.mockImplementation(() => 'https://api.telegram.org/bottoken/send`');

    await slack.sendMessage(buildMessageData)

    expect(axios.post).toHaveBeenCalledTimes(2)
  })
})

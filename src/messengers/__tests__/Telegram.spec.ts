import { analyticsData } from '__tests__/fixtures/analyticsData'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
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

  it('should correctly called Messenger.send method after calling sendMessage', async () => {
    const telegram = new Telegram(defaultConfig)

    await telegram.sendMessage(analyticsData, parsedRange, lighthouseData)

    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})

import { analyticsData } from '__tests__/fixtures/analyticsData'
import { lighthouseData } from '__tests__/fixtures/lighthouseData'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import axios from 'axios'
import { Slack } from 'messengers/Slack'

jest.spyOn(axios, 'post').mockImplementation(
  () => new Promise<void>(res => res()),
)

describe('Slack messenger', () => {
  it('should correctly created an instance', () => {
    const slack = new Slack(defaultConfig)

    expect(slack.sendMessage).toBeTruthy()
  })

  it('should correctly called Messenger.send method after calling sendMessage', async () => {
    const slack = new Slack(defaultConfig)

    await slack.sendMessage(analyticsData, parsedRange, lighthouseData)

    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})

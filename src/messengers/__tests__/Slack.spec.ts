import { analyticsData } from '__tests__/fixtures/analyticsData'
import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { parsedRange } from '__tests__/fixtures/parsedRange'
import axios from 'axios'
import { Slack } from 'messengers/Slack'

jest.spyOn(axios, 'post').mockImplementation(() => new Promise<void>(res => res()))

describe('Slack messenger', () => {
  it('should correctly created an instance', () => {
    const slack = new Slack(defaultConfig)

    expect(slack.sendMessage).toBeTruthy()
  })

  it('should sendMessage correctly sendMessage', async () => {
    const buildMessageData = {
      analytics: analyticsData,
      range: parsedRange,
      imageURL: '123',
    }
    const slack = new Slack(defaultConfig)

    await slack.sendMessage(buildMessageData)

    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})

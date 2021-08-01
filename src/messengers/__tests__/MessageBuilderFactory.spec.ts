import { defaultConfig } from '__tests__/fixtures/radiatorConfigs'
import { Integration } from 'interfaces'
import { MessageBuilderFactory } from 'messengers/MessageBuilderFactory'
import { SlackMessageBuilder } from 'messengers/SlackMessageBuilder'
import { TelegramMessageBuilder } from 'messengers/TelegramMessageBuilder'

describe('MessageBuilderFactory', () => {
  it('should correctly return a slack integration', () => {
    const builder = MessageBuilderFactory.createMessageBuilder(Integration.slack, defaultConfig)

    expect(builder).toBeInstanceOf(SlackMessageBuilder)
  })

  it('should correctly return a telegram integration', () => {
    const builder = MessageBuilderFactory.createMessageBuilder(Integration.telegram, defaultConfig)

    expect(builder).toBeInstanceOf(TelegramMessageBuilder)
  })
})

import { defaultConfig } from '__tests__/fixtures/defaultRadiatorConfigs'
import { MessageBuilderFactory } from 'messengers/MessageBuilderFactory'
import { SlackMessageBuilder } from 'messengers/SlackMessageBuilder'

describe('MessageBuilderFactory', () => {
  it('should correctly return a slack integration', () => {
    const builder = MessageBuilderFactory.createMessageBuilder(defaultConfig)

    expect(builder).toBeInstanceOf(SlackMessageBuilder)
  })
})

import { RadiatorConfig } from 'interfaces'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { SlackMessageBuilder } from 'messengers/SlackMessageBuilder'

export class MessageBuilderFactory {
  public static createMessageBuilder(
    config: RadiatorConfig,
  ): MessageBuilder {
    return new SlackMessageBuilder(config)
  }
}

import { Integration, RadiatorConfig } from 'interfaces'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { SlackMessageBuilder } from 'messengers/SlackMessageBuilder'
import { TelegramMessageBuilder } from 'messengers/TelegramMessageBuilder'

export class MessageBuilderFactory {
  public static createMessageBuilder(
    integration: Integration,
    config: RadiatorConfig,
  ): MessageBuilder {
    if (integration === Integration.telegram) return new TelegramMessageBuilder(config)
    return new SlackMessageBuilder(config)
  }
}

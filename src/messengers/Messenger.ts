import axios from 'axios'
import { RadiatorConfig } from 'interfaces'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { BuildMessageData } from 'messengers/interfaces'

export abstract class Messenger {
  protected readonly config: RadiatorConfig

  protected abstract readonly messageBuilder: MessageBuilder

  public abstract sendMessage(buildMessageData: BuildMessageData): Promise<void>

  constructor(config: RadiatorConfig) {
    this.config = config
  }

  protected async sendRequest(url: string, data: Object): Promise<void> {
    await axios.post(url, data)
  }
}

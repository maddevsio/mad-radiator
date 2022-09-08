import axios from 'axios'
import { MessageBuilder } from 'messengers/MessageBuilder'
import { BuildMessageDataSpec } from 'messengers/interfaces'

export abstract class Messenger {
  protected readonly config: any

  protected abstract readonly messageBuilder: MessageBuilder

  public abstract sendMessage(buildMessageData: BuildMessageDataSpec): Promise<void>

  constructor(config: any) {
    this.config = config
  }

  protected async sendRequest(url: string, data: Object): Promise<void> {
    await axios.post(url, data)
  }
}

import { Blocks } from 'blocks/Blocks'
import { SlackBlocks } from 'blocks/SlackBlocks'
import { TelegramBlocks } from 'blocks/TelegramBlocks'
import { Integration } from 'interfaces'

export class BlocksFactory {
  public static createBlocksService(integration: Integration): Blocks {
    if (integration === Integration.telegram) return new TelegramBlocks()
    return new SlackBlocks()
  }
}

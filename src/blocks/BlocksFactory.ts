import { Blocks } from 'blocks/Blocks'
import { SlackBlocks } from 'blocks/SlackBlocks'

export class BlocksFactory {
  public static createBlocksService(): Blocks {
    return new SlackBlocks()
  }
}

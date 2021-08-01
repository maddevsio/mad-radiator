import { BlocksFactory } from 'blocks/BlocksFactory'
import { SlackBlocks } from 'blocks/SlackBlocks'
import { TelegramBlocks } from 'blocks/TelegramBlocks'
import { Integration } from 'interfaces'

describe('BlocksFactory', () => {
  it('should correctly return telegram block service', () => {
    const blocks = BlocksFactory.createBlocksService(Integration.telegram)

    expect(blocks).toBeInstanceOf(TelegramBlocks)
  })

  it('should correctly return slack block service', () => {
    const blocks = BlocksFactory.createBlocksService(Integration.slack)

    expect(blocks).toBeInstanceOf(SlackBlocks)
  })
})

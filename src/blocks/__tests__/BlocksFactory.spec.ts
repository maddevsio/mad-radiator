import { BlocksFactory } from 'blocks/BlocksFactory'
import { SlackBlocks } from 'blocks/SlackBlocks'

describe('BlocksFactory', () => {
  it('should correctly return slack block service', () => {
    const blocks = BlocksFactory.createBlocksService()

    expect(blocks).toBeInstanceOf(SlackBlocks)
  })
})

import { divider } from 'integrations/slack/blocks/divider'

describe('divider slack block', () => {
  it('should correctly return divider', () => {
    const result = divider()
    expect(result).toEqual({ type: 'divider' })
  })
})

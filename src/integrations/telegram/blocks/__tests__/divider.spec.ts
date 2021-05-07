import { divider } from 'integrations/telegram/blocks/divider'

describe('divider telegram block', () => {
  it('should correctly return divider block', () => {
    const result = divider()

    expect(result).toBe('———\n')
  })
})

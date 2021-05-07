import { section } from 'integrations/telegram/blocks/section'

describe('section telegram block', () => {
  it('should correctly return section block', () => {
    const text = 'Text'

    const result = section(text)

    expect(result).toEqual('Text\n\n')
  })
})

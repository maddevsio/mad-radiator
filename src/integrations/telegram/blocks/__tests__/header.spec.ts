import { header } from 'integrations/telegram/blocks/header'

describe('header telegram block', () => {
  it('should correctly return header block', () => {
    const text = 'Some text'

    const result = header(text)

    expect(result).toBe('*Some text*\n')
  })
})

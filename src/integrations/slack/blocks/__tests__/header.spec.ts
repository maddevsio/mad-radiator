import { header } from 'integrations/slack/blocks/header'

describe('header slack block', () => {
  it('should correctly return header', () => {
    const text = 'Some text'

    const result = header(text)

    expect(result).toEqual({
      type: 'header',
      text: {
        type: 'plain_text',
        emoji: true,
        text,
      },
    })
  })
})

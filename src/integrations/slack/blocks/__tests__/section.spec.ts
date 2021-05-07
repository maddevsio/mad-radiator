import { section } from 'integrations/slack/blocks/section'

describe('section slack block', () => {
  it('should correctly return section', () => {
    const text = 'Text'
    const type = 'mrkdwn'

    const result = section(text, type)

    expect(result).toEqual({
      type: 'section',
      text: {
        type,
        text: `${text}\n\n`,
      },
    })
  })

  it('should correctly return section with default type', () => {
    const text = 'Text'
    const type = 'mrkdwn'

    const result = section(text)

    expect(result).toEqual({
      type: 'section',
      text: {
        type,
        text: `${text}\n\n`,
      },
    })
  })
})

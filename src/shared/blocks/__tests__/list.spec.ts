import { Integration } from 'enums'
import { list } from 'shared/blocks/list'

describe('list shared block', () => {
  it('should correctly return list with slack', () => {
    const items = ['item', 'item2', 'item3']

    const result = list(items, Integration.slack)

    expect(result).toEqual(items.join('\n\n'))
  })

  it('should correctly return list with telegram', () => {
    const items = ['item', 'item2', 'item3']

    const result = list(items, Integration.telegram)

    expect(result).toEqual(items.join('\n'))
  })
})

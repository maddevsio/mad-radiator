import { Integration, Rate } from 'enums'
import { CoreItem } from 'interfaces/analytics'
import { listItem } from 'shared/blocks/listItem'

describe('listItem shared block', () => {
  it('should correctly return listItem', () => {
    const entity: CoreItem = {
      rate: Rate.good,
      difference: '+25',
      value: 15,
      previous: 25,
    }
    const title = 'Title'
    const emoji = 'door'
    const parensKey = 'difference'
    const valueType = ''
    const parensType = '%'

    const result = listItem(
      entity,
      title,
      emoji,
      parensKey,
      Integration.slack,
      valueType,
      parensType,
    )

    expect(result).toBe(':partying_face: :door: Title: *15* (+25%)')
  })

  it('should correctly return listItem with default parens & value types', () => {
    const entity: CoreItem = {
      rate: Rate.good,
      difference: '+25',
      value: 15,
      previous: 25,
    }
    const title = 'Title'
    const emoji = 'door'
    const parensKey = 'difference'

    const result = listItem(entity, title, emoji, parensKey, Integration.slack)

    expect(result).toBe(':partying_face: :door: Title: *15* (+25)')
  })
})

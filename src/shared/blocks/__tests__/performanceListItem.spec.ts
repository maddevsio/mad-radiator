import { Emoji, Integration, Rate } from 'enums'
import { LighthouseEntity } from 'interfaces/lighthouse'
import { performanceListItem } from 'shared/blocks/performanceListItem'

describe('performanceListItem shared block', () => {
  it('should correctly return performanceListItem', () => {
    const entity: LighthouseEntity = {
      rate: Rate.good,
      title: 'SEO',
      value: 95,
    }

    const emoji = Emoji.notFound

    const result = performanceListItem(entity, emoji, Integration.slack)

    expect(result).toBe(':partying_face: :x: SEO: *95%*')
  })
})

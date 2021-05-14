import { Integration, Rate } from 'enums'
import { LighthouseEntity } from 'interfaces/lighthouse'
import { performanceListItem } from 'shared/blocks/performanceListItem'

describe('performanceListItem shared block', () => {
  it('should correctly return performanceListItem', () => {
    const entity: LighthouseEntity = {
      rate: Rate.good,
      title: 'SEO',
      value: 95,
    }

    const result = performanceListItem(entity, 'sports_medal', Integration.slack)

    expect(result).toBe(':yum: :sports_medal: SEO: *95%*')
  })
})

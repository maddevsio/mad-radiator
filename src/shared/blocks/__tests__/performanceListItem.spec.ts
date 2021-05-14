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

    const result = performanceListItem(entity, '+1', Integration.slack)

    expect(result).toBe(':partying_face: :+1: SEO: *95%*')
  })
})

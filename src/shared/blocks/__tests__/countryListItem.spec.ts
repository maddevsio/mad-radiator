import { Integration, Rate } from 'enums'
import { Country } from 'interfaces/analytics'
import { countryListItem } from 'shared/blocks/countryListItem'

describe('countryListItem shared block', () => {
  it('should correctly return string block', () => {
    const entity: Country = {
      title: 'India',
      percentage: 25,
      value: 1,
      rate: Rate.good,
    }

    const result = countryListItem(entity, Integration.slack)

    expect(result).toBe(':flag-in: India: *25%* от всех посетителей сайта')
  })

  it('should correctly return string block with undefined country', () => {
    const entity: Country = {
      title: 'not defined country',
      percentage: 25,
      value: 1,
      rate: Rate.good,
    }

    const result = countryListItem(entity, Integration.slack)

    expect(result).toBe(':flags: not defined country: *25%* от всех посетителей сайта')
  })

  it('should correctly return string block with defined country without flag', () => {
    const entity: Country = {
      title: 'Algeria',
      percentage: 25,
      value: 1,
      rate: Rate.good,
    }

    const result = countryListItem(entity, Integration.slack)

    expect(result).toBe(':flags: Algeria: *25%* от всех посетителей сайта')
  })
})

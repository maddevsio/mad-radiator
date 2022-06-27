import { parsedRange } from '__tests__/fixtures/parsedRange'
import { BlogsRepository } from 'analytics/BlogsRepository'
import { ChartRepository } from 'analytics/ChartRepository'
import { ContactMeRepository } from 'analytics/ContactMeRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
import { RepositoryFactory, RepositoryType, RepositoryTypes } from 'analytics/RepositoryFactory'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'

describe('RepositoryFactroy', () => {
  it('should correctly return an instance', () => {
    const factory = new RepositoryFactory()
    expect(factory.createRepository).toBeTruthy()
  })

  const createRepositoryCases = [
    [RepositoryTypes.countries, CountriesRepository],
    [RepositoryTypes.chart, ChartRepository],
    [RepositoryTypes.core, CoreRepository],
    [RepositoryTypes.contactMe, ContactMeRepository],
    [RepositoryTypes.blogs, BlogsRepository],
  ]

  it.each(createRepositoryCases)(
    'createRepository should return correct instance for %s',
    (...args) => {
      const Repository = args[1] as RepositoryType | any
      const factory = new RepositoryFactory()
      const repository = factory.createRepository(
        args[0] as RepositoryTypes,
        defaultAnalyticsParams,
        parsedRange,
      )
      expect(repository).toBeInstanceOf(Repository)
    },
  )

  it('should return correct instance for core', () => {
    const factory = new RepositoryFactory()
    const repository = factory.createRepository(
      RepositoryTypes.core,
      defaultAnalyticsParams,
      parsedRange,
    )
    expect(repository).toBeInstanceOf(CoreRepository)
  })
})

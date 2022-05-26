import { parsedRange } from '__tests__/fixtures/parsedRange'
import { ChartRepository } from 'analytics/ChartRepository'
import { CoreRepository } from 'analytics/CoreRepository'
import { CountriesRepository } from 'analytics/CountriesRepository'
// import { GoalsRepository } from 'analytics/GoalsRepository'
import { RepositoryFactory, RepositoryType, RepositoryTypes } from 'analytics/RepositoryFactory'

import { defaultAnalyticsParams } from '../../__tests__/fixtures/defaultAnalyticsParams'

describe('RepositoryFactroy', () => {
  it('should correctly return an instance', () => {
    const factory = new RepositoryFactory()
    expect(factory.createRepository).toBeTruthy()
  })

  const createRepositoryCases = [
    [RepositoryTypes.countries, CountriesRepository],
    // [RepositoryTypes.goals, GoalsRepository],
    [RepositoryTypes.chart, ChartRepository],
    [RepositoryTypes.core, CoreRepository],
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
})

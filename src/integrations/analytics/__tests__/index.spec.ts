import { Emoji, RangeType, Rate } from 'enums'
import main from 'integrations/analytics'
import * as auth from 'integrations/analytics/auth'
import * as getCoreData from 'integrations/analytics/getCoreData'
import * as getCountriesData from 'integrations/analytics/getCountriesData'
import * as getDevicesData from 'integrations/analytics/getDevicesData'
import * as getGoalsData from 'integrations/analytics/getGoalsData'
import { CoreItems, Country, Device, Goals } from 'interfaces/analytics'
import radiatorConfigFixture from 'tests/fixtures/radiatorConfig'

const coreItems: CoreItems = {
  users: {
    value: 0,
    previous: 5,
    difference: '+10',
    rate: Rate.good,
  },
  sessions: {
    value: 0,
    previous: 5,
    difference: '+10',
    rate: Rate.good,
  },
  bounceRate: {
    value: 0,
    previous: 5,
    difference: '+10',
    rate: Rate.good,
  },
  duration: {
    value: 0,
    previous: 5,
    difference: '+10',
    rate: Rate.good,
  },
}
jest.spyOn(getCoreData, 'getCoreData').mockImplementation(() => Promise.resolve(coreItems))

const countries: Array<Country> = []
jest
  .spyOn(getCountriesData, 'getCountriesData')
  .mockImplementation(() => Promise.resolve(countries))

const devices: Array<Device> = []
jest.spyOn(getDevicesData, 'getDevicesData').mockImplementation(() => Promise.resolve(devices))

const goals: Goals = [
  {
    name: 'Career',
    previous: 0,
    value: 2,
    rate: Rate.good,
    emoji: Emoji.zap,
  },
]
jest.spyOn(getGoalsData, 'getGoalsData').mockImplementation(() => Promise.resolve(goals))

describe('Radiator > analytics > index', () => {
  it('should correctly called all methods and returns object with data', async () => {
    jest.spyOn(auth, 'authorize').mockImplementation(() => new Promise(res => res(jest.fn())))

    const baseRange = {
      startDate: '7DaysAgo',
      endDate: '1DaysAgo',
    }
    const range = {
      originalRange: baseRange,
      previousRange: baseRange,
      range: RangeType.day,
      text: 'Today',
    }

    const data = await main(range, radiatorConfigFixture)

    expect(auth.authorize).toHaveBeenCalledTimes(1)
    expect(getCoreData.getCoreData).toHaveBeenCalledTimes(1)
    expect(getCountriesData.getCountriesData).toHaveBeenCalledTimes(1)
    expect(getDevicesData.getDevicesData).toHaveBeenCalledTimes(1)
    expect(getGoalsData.getGoalsData).toHaveBeenCalledTimes(1)

    expect(data).toEqual({
      core: {
        bounceRate: {
          difference: '+10',
          previous: 5,
          rate: 'good',
          value: 0,
        },
        duration: {
          difference: '+10',
          previous: 5,
          rate: 'good',
          value: 0,
        },
        sessions: {
          difference: '+10',
          previous: 5,
          rate: 'good',
          value: 0,
        },
        users: {
          difference: '+10',
          previous: 5,
          rate: 'good',
          value: 0,
        },
      },
      countries: [],
      devices: [],
      goals: {
        career: {
          previous: 3,
          value: 5,
        },
        contacts: {
          previous: 3,
          value: 5,
        },
        leads: {
          previous: 3,
          value: 5,
        },
      },
    })
  })
})

import { MockedDate } from '__tests__/fixtures/MockedDate'
import { RangeType } from 'interfaces'
import { parseRange } from 'utils/parseRange'
import 'moment-timezone'

jest.mock('moment', () => () => ({
  tz: () => ({
    subtract: () => ({
      format: () => '25/4/2021',
    }),
  }),
  subtract: () => ({
    format: () => '25/4/2021',
  }),
}))

jest.mock('moment-timezone', () => () => ({
  tz: () => ({
    subtract: () => ({
      format: () => '25/4/2021',
    }),
  }),
  subtract: () => ({
    format: () => '25/4/2021',
  }),
}))


// const mockedMoment = moment as jest.Mock<moment>

describe('parseRange utility', () => {
  const timeZone = 'America/Los_Angeles'
  beforeEach(() => {
    // @ts-ignore
    global.Date = MockedDate
  })

  it('should correctly return range for day with no arguments', () => {
    expect(parseRange()).toEqual({
      range: 'day',
      originalRange: {
        startDate: '1DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '2DaysAgo',
        endDate: '2DaysAgo',
      },
      text: '25/4/2021',
    })
  })

  it('should correctly return range for day with day arg', () => {
    expect(parseRange(RangeType.day, timeZone)).toEqual({
      range: 'day',
      originalRange: {
        startDate: '1DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '2DaysAgo',
        endDate: '2DaysAgo',
      },
      text: '25/4/2021',
    })
  })

  it('should correctly return range for week with week arg', () => {
    expect(parseRange(RangeType.week, timeZone)).toEqual({
      range: 'week',
      originalRange: {
        startDate: '7DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '14DaysAgo',
        endDate: '7DaysAgo',
      },
      text: '25/4/2021 - 25/4/2021',
    })
  })

  it('should correctly return range for month with month arg', () => {
    expect(parseRange(RangeType.month, timeZone)).toEqual({
      range: 'month',
      originalRange: {
        startDate: '30DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '60DaysAgo',
        endDate: '30DaysAgo',
      },
      text: '25/4/2021 - 25/4/2021',
    })
  })
})

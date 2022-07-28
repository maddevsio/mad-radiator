import { MockedDate } from '__tests__/fixtures/MockedDate'
import { RangeType } from 'interfaces'
import { parseRange } from 'utils/parseRange'

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

describe('parseRange utility', () => {
  beforeEach(() => {
    // @ts-ignore
    global.Date = MockedDate
  })

  it('should correctly return range for day with no arguments', () => {
    expect(parseRange()).toEqual({
      range: 'day',
      originalRange: {
        startDate: '1daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '2daysAgo',
        endDate: '2daysAgo',
      },
      text: '25/4/2021',
    })
  })

  it('should correctly return range for day with day arg', () => {
    expect(parseRange(RangeType.day)).toEqual({
      range: 'day',
      originalRange: {
        startDate: '1daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '2daysAgo',
        endDate: '2daysAgo',
      },
      text: '25/4/2021',
    })
  })

  it('should correctly return range for week with week arg', () => {
    expect(parseRange(RangeType.week)).toEqual({
      range: 'week',
      originalRange: {
        startDate: '7daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '14daysAgo',
        endDate: '7daysAgo',
      },
      text: '25/4/2021 - 25/4/2021',
    })
  })

  it('should correctly return range for month with month arg', () => {
    expect(parseRange(RangeType.month)).toEqual({
      range: 'month',
      originalRange: {
        startDate: '30daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '60daysAgo',
        endDate: '30daysAgo',
      },
      text: '25/4/2021 - 25/4/2021',
    })
  })
})

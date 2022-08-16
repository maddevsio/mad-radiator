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
  format: () => "2018–01–30T12:34:56+00:00"
}))

describe('parseRange utility', () => {
  beforeEach(() => {
    // @ts-ignore
    global.Date = MockedDate
  })

  it('should correctly return range for day with no arguments', () => {
    expect(JSON.stringify(parseRange())).toEqual(JSON.stringify({
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
    }))
  })

  it('should correctly return range for day with day arg', () => {
    expect(JSON.stringify(parseRange(RangeType.day))).toEqual(JSON.stringify({
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
    }))
  })

  it('should correctly return range for week with week arg', () => {
    expect(JSON.stringify(parseRange(RangeType.week))).toEqual(JSON.stringify({
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
    }))
  })

  it('should correctly return range for month with month arg', () => {
    expect(JSON.stringify(parseRange(RangeType.month))).toEqual(JSON.stringify({
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
    }))
  })
})

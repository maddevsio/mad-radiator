import { MockedDate } from '__tests__/fixtures/MockedDate'
import { RangeType } from 'interfaces'
import { parseRange } from 'utils/parseRange'

jest.mock('moment', () => () => ({
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
    expect(parseRange(RangeType.day)).toEqual({
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
    expect(parseRange(RangeType.week)).toEqual({
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
    expect(parseRange(RangeType.month)).toEqual({
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

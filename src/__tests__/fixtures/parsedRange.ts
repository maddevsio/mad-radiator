import { ParsedRange, RangeType } from 'interfaces'
import moment from 'moment'

export const parsedRange: ParsedRange = {
  range: RangeType.day,
  originalRange: {
    startDate: '1daysAgo',
    endDate: '1daysAgo',
  },
  previousRange: {
    startDate: '2daysAgo',
    endDate: '2daysAgo',
  },
  text: '31/7/2021',
  analyticsDate: moment("2017-11-07T12:56:00.000")
}

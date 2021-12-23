import { ParsedRange, RangeType } from 'interfaces'
import moment from 'moment'
import 'moment-timezone'

const DEFAULT_FORMAT = 'DD/MM/YYYY'
const DEFAULT_TIME_ZONE = 'Asia/Bishkek'

function getYesterday(timeZone: string): string {
  return moment().tz(timeZone).subtract(1, 'day').format(DEFAULT_FORMAT)
}

function getLastWeek(timeZone: string): string {
  const end = getYesterday(timeZone)
  const start = moment().subtract(1, 'week').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

function getLastMonth(timeZone: string): string {
  const end = getYesterday(timeZone)
  const start = moment().subtract(1, 'month').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

export function parseRange(range: string | RangeType = RangeType.day, timeZone: string = DEFAULT_TIME_ZONE): ParsedRange {
  if (range === RangeType.day) {
    return {
      range,
      originalRange: {
        startDate: '1DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '2DaysAgo',
        endDate: '2DaysAgo',
      },
      text: getYesterday(timeZone),
    }
  }

  if (range === RangeType.week) {
    return {
      range,
      originalRange: {
        startDate: '7DaysAgo',
        endDate: '1DaysAgo',
      },
      previousRange: {
        startDate: '14DaysAgo',
        endDate: '7DaysAgo',
      },
      text: getLastWeek(timeZone),
    }
  }

  return {
    range,
    originalRange: {
      startDate: '30DaysAgo',
      endDate: '1DaysAgo',
    },
    previousRange: {
      startDate: '60DaysAgo',
      endDate: '30DaysAgo',
    },
    text: getLastMonth(timeZone),
  }
}

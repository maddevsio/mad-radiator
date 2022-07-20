import { ParsedRange, RangeType } from 'interfaces'
import moment from 'moment'
import 'moment-timezone'

const DEFAULT_FORMAT = 'DD/MM/YYYY'
const DEFAULT_TIME_ZONE = 'Asia/Bishkek'

function getYesterday(): string {
  return moment().tz(DEFAULT_TIME_ZONE).subtract(1, 'day').format(DEFAULT_FORMAT)
}

function getLastWeek(): string {
  const end = getYesterday()
  const start = moment().subtract(1, 'week').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

function getLastMonth(): string {
  const end = getYesterday()
  const start = moment().subtract(1, 'month').format(DEFAULT_FORMAT)
  return `${start} - ${end}`
}

export function parseRange(range: string | RangeType = RangeType.day): ParsedRange {
  if (range === RangeType.day) {
    return {
      range,
      originalRange: {
        startDate: '1daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '2daysAgo',
        endDate: '2daysAgo',
      },
      text: getYesterday(),
    }
  }

  if (range === RangeType.week) {
    return {
      range,
      originalRange: {
        startDate: '7daysAgo',
        endDate: '1daysAgo',
      },
      previousRange: {
        startDate: '14daysAgo',
        endDate: '7daysAgo',
      },
      text: getLastWeek(),
    }
  }

  return {
    range,
    originalRange: {
      startDate: '30daysAgo',
      endDate: '1daysAgo',
    },
    previousRange: {
      startDate: '60daysAgo',
      endDate: '30daysAgo',
    },
    text: getLastMonth(),
  }
}

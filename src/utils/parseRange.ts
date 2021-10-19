import { ParsedRange, RangeType } from 'interfaces'
import moment from 'moment'

const DEFAULT_FORMAT = 'DD/MM/YYYY'

function getYesterday(): string {
  return moment().subtract(1, 'day').format(DEFAULT_FORMAT)
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

export function parseRange(range: RangeType = RangeType.day): ParsedRange {
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
      text: getYesterday(),
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
      text: getLastWeek(),
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
    text: getLastMonth(),
  }
}
